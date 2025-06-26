import { z } from "zod";
import { GeneralErrorCodeSchema } from "../../errors";

/** Individual candle data point */
export const CandleSchema = z.object({
	/** Open price */
	o: z.string(),
	/** Close price */
	c: z.string(),
	/** Highest price */
	h: z.string(),
	/** Lowest price */
	l: z.string(),
	/** Trading volume (Only for trades candles) */
	v: z.string().optional(),
	/** Starting timestamp (in epoch milliseconds) for the candle */
	T: z.number().int(),
});

export type Candle = z.infer<typeof CandleSchema>;

/** Success response schema for candles endpoint */
export const GetCandlesHistorySuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Array of candle data points */
	data: z.array(CandleSchema),
});

/** Error response schema for candles endpoint */
export const GetCandlesHistoryErrorSchema = z.object({
	/** Response status - "ERROR" for error responses */
	status: z.literal("ERROR"),
	/** Error details */
	error: z.object({
		/** Error code from the Extended API */
		code: GeneralErrorCodeSchema,
		/** Descriptive error message */
		message: z.string(),
	}),
});

/** Discriminated union for candles endpoint response */
export const GetCandlesHistoryResponseSchema = z.discriminatedUnion("status", [
	GetCandlesHistorySuccessSchema,
	GetCandlesHistoryErrorSchema,
]);
