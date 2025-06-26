import { z } from "zod";
import { MarketErrorCodeSchema } from "../markets";

// Order book entry with quantity and price
export const OrderBookEntrySchema = z.object({
	/** Quantity for the price level */
	qty: z.string(),
	/** Price level */
	price: z.string(),
});

// Market order book structure
export const MarketOrderBookSchema = z.object({
	/** Market name */
	market: z.string(),
	/** List of bid orders */
	bid: z.array(OrderBookEntrySchema),
	/** List of ask orders */
	ask: z.array(OrderBookEntrySchema),
});

export const GetMarketOrderBookSuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Market order book data */
	data: MarketOrderBookSchema,
});

export const GetMarketOrderBookErrorSchema = z.object({
	/** Response status - "ERROR" for error responses */
	status: z.literal("ERROR"),
	/** Error details */
	error: z.object({
		/** Error code from the Extended API */
		code: MarketErrorCodeSchema,
		/** Descriptive error message */
		message: z.string(),
	}),
});

export const GetMarketOrderBookResponseSchema = z.discriminatedUnion("status", [
	GetMarketOrderBookSuccessSchema,
	GetMarketOrderBookErrorSchema,
]);
