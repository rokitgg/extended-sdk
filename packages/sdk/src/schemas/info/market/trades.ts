import { z } from "zod";
import { MarketErrorCodeSchema, MarketTradeSchema } from "../markets";

// Response schemas for market trades endpoint
export const GetMarketTradesSuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Array of market trades */
	data: z.array(MarketTradeSchema),
});

export const GetMarketTradesErrorSchema = z.object({
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

export const GetMarketTradesResponseSchema = z.discriminatedUnion("status", [
	GetMarketTradesSuccessSchema,
	GetMarketTradesErrorSchema,
]);

// Type exports
export type GetMarketTradesResponse = z.infer<
	typeof GetMarketTradesResponseSchema
>;
export type MarketTrade = z.infer<typeof MarketTradeSchema>;
