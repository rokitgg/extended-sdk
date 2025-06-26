import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient, InvalidInputError } from "../../../src";
import { MarketTradeSchema } from "../../../src/schemas/info/markets";

/**
 * Market Last Trades Endpoint
 * Get the latest trades for an individual market.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/markets/{market}/trades
 * @param market - The market to query.
 * @returns An array of market trades.
 * @see https://api.docs.extended.exchange/#get-market-last-trades
 * @example
 * ```ts
 * const trades = await client.marketTrades("BTC-USD");
 * ```
 */

describe("Market Last Trades Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should successfully fetch market trades", async () => {
		const trades = await client.marketTrades("BTC-USD");

		// Validate that we got an array
		expect(Array.isArray(trades)).toBe(true);
		expect(trades.length).toBeGreaterThan(0);

		// Validate the first trade against schema
		const result = MarketTradeSchema.safeParse(trades[0]);
		expect(result.success).toBe(true);
	});

	it("should validate trade data structure", async () => {
		const trades = await client.marketTrades("BTC-USD");

		expect(trades).toBeDefined();
		expect(trades.length).toBeGreaterThan(0);

		// Validate each trade against schema
		for (const trade of trades) {
			const result = MarketTradeSchema.safeParse(trade);
			expect(result.success).toBe(true);

			if (result.success) {
				const validatedTrade = result.data;

				// Validate required fields
				expect(typeof validatedTrade.i).toBe("number");
				expect(typeof validatedTrade.m).toBe("string");
				expect(["BUY", "SELL"]).toContain(validatedTrade.S);
				expect(["TRADE", "LIQUIDATION", "DELEVERAGE"]).toContain(
					validatedTrade.tT,
				);
				expect(typeof validatedTrade.T).toBe("number");
				expect(typeof validatedTrade.p).toBe("string");
				expect(typeof validatedTrade.q).toBe("string");

				// Validate numeric fields
				expect(validatedTrade.i).toBeGreaterThan(0);
				expect(validatedTrade.T).toBeGreaterThan(0);
				expect(Number(validatedTrade.p)).toBeGreaterThan(0);
				expect(Number(validatedTrade.q)).toBeGreaterThan(0);
			}
		}
	});

	it("should throw on empty market argument", async () => {
		await expect(client.marketTrades("")).rejects.toThrow(InvalidInputError);
	});

	it("should throw on lower-case market inputs", async () => {
		await expect(client.marketTrades("btc-usd")).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on malformed market names", async () => {
		await expect(client.marketTrades("invalid@market")).rejects.toThrow(
			InvalidInputError,
		);
		await expect(client.marketTrades("market with spaces")).rejects.toThrow(
			InvalidInputError,
		);
		await expect(client.marketTrades("123")).rejects.toThrow(InvalidInputError);
	});

	it("should handle non-existent market gracefully", async () => {
		const trades = await client.marketTrades("NONEXISTENT-MARKET");

		// API returns empty array for non-existent markets
		expect(Array.isArray(trades)).toBe(true);
		expect(trades.length).toBe(0);
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();

		// Cancel the request immediately
		controller.abort();

		await expect(
			client.marketTrades("BTC-USD", controller.signal),
		).rejects.toThrow();
	});
});
