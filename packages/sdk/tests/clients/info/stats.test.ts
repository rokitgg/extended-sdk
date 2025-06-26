import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient, InvalidInputError } from "../../../src";
import { MarketStatsWithDeleverageSchema as MarketStatsSchema } from "../../../src/schemas/info/market/stats";

/**
 * Market Stats Endpoint
 * Get the latest trading statistics for an individual market.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/markets/{market}/stats
 * @param market - The market to query.
 * @returns An object containing the market statistics.
 * @see https://api.docs.extended.exchange/?utm_source=chatgpt.com#get-market-statistics
 * @example
 * ```ts
 * const stats = await client.marketStats("BTC-USD");
 * ```
 */

describe("Market Stats Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should succesfully query stats for single market", async () => {
		const stats = await client.marketStats("BTC-USD");

		expect(stats).toBeDefined();

		// Validate the market against schema
		const result = MarketStatsSchema.safeParse(stats);
		expect(result.success).toBe(true);
		expect(result.data?.dailyVolume).not.toBe("0");
	});

	it("should validate output matches the schema", async () => {
		const stats = await client.marketStats("BTC-USD");

		const result = MarketStatsSchema.safeParse(stats);
		expect(result.success).toBe(true);

		if (result.success) {
			// Additional validation for required fields
			expect(typeof result.data.dailyVolume).toBe("string");
			expect(typeof result.data.lastPrice).toBe("string");
			expect(typeof result.data.fundingRate).toBe("string");
			expect(typeof result.data.nextFundingRate).toBe("number");
			expect(Array.isArray(result.data.deleverageLevels.longPositions)).toBe(
				true,
			);
			expect(Array.isArray(result.data.deleverageLevels.shortPositions)).toBe(
				true,
			);
		}
	});

	it("should throw on empty argument", async () => {
		await expect(client.marketStats("")).rejects.toThrow(InvalidInputError);
	});

	it("should throw on lower-case market inputs", async () => {
		await expect(client.marketStats("btc-usd")).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on malformed market names", async () => {
		await expect(client.marketStats("invalid@market")).rejects.toThrow(
			InvalidInputError,
		);
		await expect(client.marketStats("market with spaces")).rejects.toThrow(
			InvalidInputError,
		);
		await expect(client.marketStats("123")).rejects.toThrow(InvalidInputError);
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();

		// Cancel the request immediately
		controller.abort();

		await expect(
			client.marketStats("BTC-USD", controller.signal),
		).rejects.toThrow();
	});
});
