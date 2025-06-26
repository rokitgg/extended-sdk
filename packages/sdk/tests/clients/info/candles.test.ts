import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient } from "../../../src";
import { InvalidInputError } from "../../../src/errors/base";
import {
	CandleSchema,
	GetCandlesHistoryResponseSchema,
} from "../../../src/schemas/info/market/candles";

/**
 * Candles History Endpoint
 * Get the candles history for an individual market for the timeframe specified in the request.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/candles/{market}/{candleType}
 * @param market - Name of the requested market.
 * @param candleType - Price type: "trades", "mark-prices", or "index-prices".
 * @param interval - The time interval between data points.
 * @param limit - The maximum number of items to return.
 * @param endTime - Optional end timestamp (in epoch milliseconds).
 * @returns Array of candle data points.
 * @see https://api.docs.extended.exchange/#get-candles-history
 * @example
 * ```ts
 * const candles = await client.candles("BTC-USD", "trades", "1m", 1000);
 * ```
 */

describe("Candles History Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should return candle data for trades price type", async () => {
		const candles = await client.candles("BTC-USD", "trades", "1m", 10);

		expect(Array.isArray(candles)).toBe(true);
		expect(candles.length).toBeLessThanOrEqual(10);

		if (candles.length > 0) {
			// Validate the first candle against schema
			const result = CandleSchema.safeParse(candles[0]);
			expect(result.success).toBe(true);

			if (result.success) {
				const candle = result.data;
				expect(candle.o).toBeDefined();
				expect(candle.c).toBeDefined();
				expect(candle.h).toBeDefined();
				expect(candle.l).toBeDefined();
				expect(candle.v).toBeDefined();
				expect(candle.T).toBeGreaterThan(0);
			}
		}
	});

	it("should return candle data for mark-prices price type", async () => {
		const candles = await client.candles("BTC-USD", "mark-prices", "1m", 10);

		expect(Array.isArray(candles)).toBe(true);
		expect(candles.length).toBeLessThanOrEqual(10);

		if (candles.length > 0) {
			const result = CandleSchema.safeParse(candles[0]);
			expect(result.success).toBe(true);

			if (result.success) {
				const candle = result.data;
				expect(candle.o).toBeDefined();
				expect(candle.c).toBeDefined();
				expect(candle.h).toBeDefined();
				expect(candle.l).toBeDefined();
				expect(candle.T).toBeGreaterThan(0);
			}
		}
	});

	it("should return candle data for index-prices price type", async () => {
		const candles = await client.candles("BTC-USD", "index-prices", "1m", 10);

		expect(Array.isArray(candles)).toBe(true);
		expect(candles.length).toBeLessThanOrEqual(10);

		if (candles.length > 0) {
			const result = CandleSchema.safeParse(candles[0]);
			expect(result.success).toBe(true);

			if (result.success) {
				const candle = result.data;
				expect(candle.o).toBeDefined();
				expect(candle.c).toBeDefined();
				expect(candle.h).toBeDefined();
				expect(candle.l).toBeDefined();
				expect(candle.T).toBeGreaterThan(0);
			}
		}
	});

	it("should handle different intervals", async () => {
		const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

		for (const interval of intervals) {
			const candles = await client.candles("BTC-USD", "trades", interval, 5);
			expect(Array.isArray(candles)).toBe(true);
			expect(candles.length).toBeLessThanOrEqual(5);
		}
	});

	it("should respect the limit parameter", async () => {
		const limit = 3;
		const candles = await client.candles("BTC-USD", "trades", "1m", limit);

		expect(Array.isArray(candles)).toBe(true);
		expect(candles.length).toBeLessThanOrEqual(limit);
	});

	it("should handle endTime parameter", async () => {
		const endTime = Date.now();
		const candles = await client.candles(
			"BTC-USD",
			"trades",
			"1m",
			10,
			endTime,
		);

		expect(Array.isArray(candles)).toBe(true);

		// If we have candles, they should be before the endTime
		if (candles.length > 0) {
			for (const candle of candles) {
				expect(candle.T).toBeLessThanOrEqual(endTime);
			}
		}
	});

	it("should validate candle data integrity", async () => {
		const candles = await client.candles("BTC-USD", "trades", "1m", 10);

		if (candles.length > 0) {
			for (const candle of candles) {
				// Validate against schema
				const result = CandleSchema.safeParse(candle);
				expect(result.success).toBe(true);

				if (result.success) {
					const validatedCandle = result.data;

					// Test that price fields can be parsed as valid numbers
					expect(Number(validatedCandle.o)).toBeGreaterThan(0);
					expect(Number(validatedCandle.c)).toBeGreaterThan(0);
					expect(Number(validatedCandle.h)).toBeGreaterThan(0);
					expect(Number(validatedCandle.l)).toBeGreaterThan(0);
					expect(Number(validatedCandle.v)).toBeGreaterThanOrEqual(0);

					// Ensure high is >= low
					expect(Number(validatedCandle.h)).toBeGreaterThanOrEqual(
						Number(validatedCandle.l),
					);

					// Ensure open and close are within high-low range
					const high = Number(validatedCandle.h);
					const low = Number(validatedCandle.l);
					const open = Number(validatedCandle.o);
					const close = Number(validatedCandle.c);

					expect(open).toBeGreaterThanOrEqual(low);
					expect(open).toBeLessThanOrEqual(high);
					expect(close).toBeGreaterThanOrEqual(low);
					expect(close).toBeLessThanOrEqual(high);
				}
			}
		}
	});

	it("should handle non-existent market gracefully", async () => {
		await expect(
			client.candles("NONEXISTENT-MARKET", "trades", "1m", 10),
		).rejects.toThrow();
	});

	it("should throw on invalid market input", async () => {
		await expect(client.candles("btc-usd", "trades", "1m", 10)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on invalid candleType", async () => {
		await expect(
			client.candles("BTC-USD", "invalid-type" as any, "1m", 10),
		).rejects.toThrow(InvalidInputError);
	});

	it("should throw on missing interval", async () => {
		await expect(client.candles("BTC-USD", "trades", "", 10)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on invalid limit", async () => {
		await expect(client.candles("BTC-USD", "trades", "1m", 0)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();
		controller.abort();

		await expect(
			client.candles(
				"BTC-USD",
				"trades",
				"1m",
				10,
				undefined,
				controller.signal,
			),
		).rejects.toThrow();
	});

	it("should validate full API response with Zod schema", async () => {
		const candles = await client.candles("BTC-USD", "trades", "1m", 5);

		// Create a mock API response structure to test the schema
		const apiResponse = { status: "OK" as const, data: candles };
		const result = GetCandlesHistoryResponseSchema.safeParse(apiResponse);
		expect(result.success).toBe(true);
	});
});
