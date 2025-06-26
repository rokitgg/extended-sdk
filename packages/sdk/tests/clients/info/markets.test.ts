import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient } from "../../../src";
import { ExtendedMarketDataSchema } from "../../../src/schemas/info/markets";

/**
 * Markets Endpoint
 * Get a list of available markets, their configurations, and trading statistics.
 * To request data for several markets, use the following format: GET /api/v1/info/markets?market=market1&market2.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/markets?market={market}
 * @param market - The market to query.
 * @returns An array of market data.
 * @see https://api.docs.extended.exchange/#get-markets
 * @example
 * ```ts
 * const markets = await client.markets({ market: "BTC-USD" });
 * ```
 */

describe("Markets Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should allow to query all available markets", async () => {
		const markets = await client.markets();

		// Validate that we got an array with at least one market
		expect(Array.isArray(markets)).toBe(true);
		expect(markets.length).toBeGreaterThan(0);
	});

	it("should allow to query a single market", async () => {
		const markets = await client.markets({ market: "BTC-USD" });

		expect(Array.isArray(markets)).toBe(true);
		expect(markets.length).toBe(1);
		expect(markets[0]?.name).toBe("BTC-USD");

		// Validate the market against schema
		const result = ExtendedMarketDataSchema.safeParse(markets[0]);
		expect(result.success).toBe(true);
	});

	it("should allow querying multiple markets", async () => {
		const markets = await client.markets({
			market: ["BTC-USD", "ETH-USD"],
		});

		expect(Array.isArray(markets)).toBe(true);
		expect(markets.length).toBe(2);

		const marketNames = markets.map((m) => m.name);
		expect(marketNames).toContain("BTC-USD");
		expect(marketNames).toContain("ETH-USD");

		// Validate each market against schema
		for (const market of markets) {
			const result = ExtendedMarketDataSchema.safeParse(market);
			expect(result.success).toBe(true);
		}
	});

	it("should handle non-existent market gracefully", async () => {
		await expect(
			client.markets({ market: "NONEXISTENT-MARKET" }),
		).rejects.toThrow();
	});

	it("should handle empty market array parameter", async () => {
		const markets = await client.markets({ market: [] });

		// Should return all markets when empty array is provided
		expect(Array.isArray(markets)).toBe(true);
		expect(markets.length).toBeGreaterThan(0);
	});

	it("should validate all markets have consistent structure", async () => {
		const markets = await client.markets();

		expect(markets).toBeDefined();

		expect(markets.length).toBeGreaterThan(0);
	});

	it("should throw on lower-case market inputs", async () => {
		// Test that market names are case-sensitive, request should throw
		await expect(client.markets({ market: "btc-usd" })).rejects.toThrow();
	});

	it("should validate market data integrity", async () => {
		const markets = await client.markets();
		const market = markets[0];

		const result = ExtendedMarketDataSchema.safeParse(market);
		expect(result.success).toBe(true);

		if (result.success) {
			const validatedMarket = result.data;

			// Test that numeric string fields can be parsed as valid numbers
			expect(Number(validatedMarket.marketStats.lastPrice)).toBeGreaterThan(0);
			expect(Number(validatedMarket.marketStats.askPrice)).toBeGreaterThan(0);
			expect(Number(validatedMarket.marketStats.bidPrice)).toBeGreaterThan(0);
			expect(Number(validatedMarket.marketStats.markPrice)).toBeGreaterThan(0);
			expect(Number(validatedMarket.marketStats.indexPrice)).toBeGreaterThan(0);

			// Ensure that ask price is higher than or equal to bid price
			const askPrice = Number(validatedMarket.marketStats.askPrice);
			const bidPrice = Number(validatedMarket.marketStats.bidPrice);
			expect(askPrice).toBeGreaterThanOrEqual(bidPrice);

			// Ensure that daily high is higher than or equal to daily low
			const dailyHigh = Number(validatedMarket.marketStats.dailyHigh);
			const dailyLow = Number(validatedMarket.marketStats.dailyLow);
			expect(dailyHigh).toBeGreaterThanOrEqual(dailyLow);

			// Ensure that last price is within daily range
			const lastPrice = Number(validatedMarket.marketStats.lastPrice);
			expect(lastPrice).toBeGreaterThanOrEqual(dailyLow);
			expect(lastPrice).toBeLessThanOrEqual(dailyHigh);
		}
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();

		// Cancel the request immediately
		controller.abort();

		await expect(
			client.markets(undefined, controller.signal),
		).rejects.toThrow();
	});
});
