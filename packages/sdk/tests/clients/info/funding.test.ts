import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient } from "../../../src";
import { InvalidInputError } from "../../../src/errors/base";
import {
	FundingRateSchema,
	GetFundingResponseSchema,
	PaginationSchema,
} from "../../../src/schemas/info/market/funding";

/**
 * Funding History Endpoint
 * Get the funding rates history for an individual market for the timeframe specified in the request.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/{market}/funding
 * @param market - Name of the requested market.
 * @param startTime - Starting timestamp (in epoch milliseconds) for the requested period.
 * @param endTime - Ending timestamp (in epoch milliseconds) for the requested period.
 * @param cursor - Optional cursor for pagination.
 * @param limit - Optional maximum number of items to return.
 * @returns Object containing funding rate data and pagination information.
 * @see https://api.docs.extended.exchange/#get-funding-rates-history
 * @example
 * ```ts
 * const funding = await client.funding("BTC-USD", startTime, endTime);
 * ```
 */

describe("Funding History Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should return funding rate data with pagination", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000; // 24 hours ago

		const result = await client.funding("BTC-USD", startTime, endTime);

		expect(result).toHaveProperty("data");
		expect(result).toHaveProperty("pagination");
		expect(Array.isArray(result.data)).toBe(true);
		expect(result.data.length).toBeGreaterThanOrEqual(0);

		if (result.data.length > 0) {
			// Validate the first funding rate against schema
			const fundingRateResult = FundingRateSchema.safeParse(result.data[0]);
			expect(fundingRateResult.success).toBe(true);

			if (fundingRateResult.success) {
				const fundingRate = fundingRateResult.data;
				expect(fundingRate.m).toBe("BTC-USD");
				expect(fundingRate.T).toBeGreaterThan(0);
				expect(fundingRate.f).toBeDefined();
			}
		}

		// Validate pagination (should always be present due to client-side fallback)
		const paginationResult = PaginationSchema.safeParse(result.pagination);
		expect(paginationResult.success).toBe(true);

		if (paginationResult.success) {
			const pagination = paginationResult.data;
			expect(pagination.cursor).toBeGreaterThanOrEqual(0);
			expect(pagination.count).toBeGreaterThanOrEqual(0);
		}
	});

	it("should handle cursor pagination", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000; // 24 hours ago

		// Get first page
		const firstPage = await client.funding(
			"BTC-USD",
			startTime,
			endTime,
			undefined,
			3,
		);

		// Only test pagination if we have a valid cursor (not 0)
		if (firstPage.data.length > 0 && firstPage.pagination.cursor > 0) {
			// Get second page using cursor
			const secondPage = await client.funding(
				"BTC-USD",
				startTime,
				endTime,
				firstPage.pagination.cursor,
				3,
			);

			expect(secondPage.data.length).toBeGreaterThanOrEqual(0);

			// Ensure we got different data (if there was more data)
			if (
				secondPage.data.length > 0 &&
				firstPage.data[0] &&
				secondPage.data[0]
			) {
				expect(secondPage.data[0].T).not.toBe(firstPage.data[0].T);
			}
		}
	});

	it("should validate funding rate data integrity", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000; // 24 hours ago

		const result = await client.funding("BTC-USD", startTime, endTime);

		if (result.data.length > 0) {
			for (const fundingRate of result.data) {
				// Validate against schema
				const schemaResult = FundingRateSchema.safeParse(fundingRate);
				expect(schemaResult.success).toBe(true);

				if (schemaResult.success) {
					const validatedRate = schemaResult.data;

					// Test that funding rate can be parsed as a valid number
					const rateValue = Number(validatedRate.f);
					expect(rateValue).toBeGreaterThanOrEqual(-1); // Funding rates can be negative
					expect(rateValue).toBeLessThanOrEqual(1); // But typically not more than 100%

					// Ensure timestamp is within the requested range
					expect(validatedRate.T).toBeGreaterThanOrEqual(startTime);
					expect(validatedRate.T).toBeLessThanOrEqual(endTime);

					// Ensure market name is correct
					expect(validatedRate.m).toBe("BTC-USD");
				}
			}
		}
	});

	it("should handle different time ranges", async () => {
		const endTime = Date.now();
		const timeRanges = [
			{ start: endTime - 60 * 60 * 1000, name: "1 hour" }, // 1 hour
			{ start: endTime - 24 * 60 * 60 * 1000, name: "24 hours" }, // 24 hours
			{ start: endTime - 7 * 24 * 60 * 60 * 1000, name: "7 days" }, // 7 days
		];

		for (const range of timeRanges) {
			const result = await client.funding("BTC-USD", range.start, endTime);
			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data.length).toBeGreaterThanOrEqual(0);
		}
	});

	it("should handle non-existent market gracefully", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000;

		await expect(
			client.funding("NONEXISTENT-MARKET", startTime, endTime),
		).rejects.toThrow();
	});

	it("should throw on invalid market input", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000;

		await expect(client.funding("btc-usd", startTime, endTime)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on invalid start time", async () => {
		const endTime = Date.now();
		const startTime = -1;

		await expect(client.funding("BTC-USD", startTime, endTime)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on invalid end time", async () => {
		const endTime = -1;
		const startTime = Date.now() - 24 * 60 * 60 * 1000;

		await expect(client.funding("BTC-USD", startTime, endTime)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw when start time is after end time", async () => {
		const endTime = Date.now() - 24 * 60 * 60 * 1000;
		const startTime = Date.now();

		await expect(client.funding("BTC-USD", startTime, endTime)).rejects.toThrow(
			InvalidInputError,
		);
	});

	it("should throw on invalid limit", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000;

		await expect(
			client.funding("BTC-USD", startTime, endTime, undefined, 0),
		).rejects.toThrow(InvalidInputError);

		await expect(
			client.funding("BTC-USD", startTime, endTime, undefined, 10001),
		).rejects.toThrow(InvalidInputError);
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();
		controller.abort();

		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000;

		await expect(
			client.funding(
				"BTC-USD",
				startTime,
				endTime,
				undefined,
				undefined,
				controller.signal,
			),
		).rejects.toThrow();
	});

	it("should validate full API response with Zod schema", async () => {
		const endTime = Date.now();
		const startTime = endTime - 24 * 60 * 60 * 1000;

		const result = await client.funding("BTC-USD", startTime, endTime);

		// Create a mock API response structure to test the schema
		const apiResponse = {
			status: "OK" as const,
			data: result.data,
			pagination: result.pagination,
		};
		const schemaResult = GetFundingResponseSchema.safeParse(apiResponse);
		expect(schemaResult.success).toBe(true);
	});

	it("should handle empty result set", async () => {
		// Use a very old time range that likely has no data
		const endTime = 1000000000000; // 2001
		const startTime = endTime - 24 * 60 * 60 * 1000;

		const result = await client.funding("BTC-USD", startTime, endTime);

		expect(Array.isArray(result.data)).toBe(true);
		expect(result.data.length).toBe(0);
		expect(result.pagination.count).toBe(0);
	});
});
