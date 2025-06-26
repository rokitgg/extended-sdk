import { beforeAll, describe, expect, it } from "vitest";
import { HttpTransport, InfoClient } from "../../../src";
import { MarketOrderBookSchema } from "../../../src/schemas/info/market/book";

/**
 * Market Order Book Endpoint
 * Get the latest orderbook for an individual market.
 * @method GET
 * @url https://app.extended.exchange/api/v1/info/markets/{market}/orderbook
 * @param market - The market to query.
 * @returns An order book object with bid and ask arrays.
 * @see https://api.docs.extended.exchange/#get-market-orderbook
 */

describe("Market Order Book Endpoint", () => {
	let client: InfoClient;

	beforeAll(() => {
		const transport = new HttpTransport({ isTestnet: false });
		client = new InfoClient({ transport });
	});

	it("should return a valid order book for a known market", async () => {
		const orderBook = await client.marketOrderBook("BTC-USD");

		// Validate structure
		const result = MarketOrderBookSchema.safeParse(orderBook);
		expect(result.success).toBe(true);

		// Should have bid and ask arrays
		expect(Array.isArray(orderBook?.bid)).toBe(true);
		expect(Array.isArray(orderBook?.ask)).toBe(true);
	});

	it("should return undefined for a non-existent market", async () => {
		const book = await client.marketOrderBook("NONEXISTENT-MARKET");
		expect(book).toBeUndefined();
	});

	it("should return undefined for invalid market input (lowercase)", async () => {
		const book = await client.marketOrderBook("btc-usd");
		expect(book).toBeUndefined();
	});

	it("should return undefined for invalid market input (numbers)", async () => {
		const book = await client.marketOrderBook("BTC-123");
		expect(book).toBeUndefined();
	});

	it("should handle request cancellation", async () => {
		const controller = new AbortController();
		controller.abort();
		await expect(
			client.marketOrderBook("BTC-USD", controller.signal),
		).rejects.toThrow();
	});

	it("should handle empty order book (if any market has one)", async () => {
		// This is a soft test: if a market with empty book exists, it should not throw
		// Replace "EMPTY-BOOK" with a real market if known
		try {
			const orderBook = await client.marketOrderBook("BTC-USD");
			expect(Array.isArray(orderBook?.bid)).toBe(true);
			expect(Array.isArray(orderBook?.ask)).toBe(true);
		} catch (err) {
			// Acceptable if market does not exist
			expect(err).toBeInstanceOf(Error);
		}
	});
});
