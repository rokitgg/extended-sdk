import { z } from "zod";
import { GeneralErrorCodeSchema } from "../../errors";

/** Individual open interest data point */
export const OpenInterestSchema = z.object({
	/** Open interest in USD */
	i: z.string(),
	/** Open interest in synthetic asset */
	I: z.string(),
	/** Timestamp (in epoch milliseconds) when the open interest was calculated */
	t: z.number().int(),
});

/** Success response schema for open interest endpoint */
export const GetOpenInterestSuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Array of open interest data points */
	data: z.array(OpenInterestSchema),
});

/** Error response schema for open interest endpoint */
export const GetOpenInterestErrorSchema = z.object({
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

/** Discriminated union for open interest endpoint response */
export const GetOpenInterestResponseSchema = z.discriminatedUnion("status", [
	GetOpenInterestSuccessSchema,
	GetOpenInterestErrorSchema,
]);

// Type exports
export type OpenInterest = z.infer<typeof OpenInterestSchema>;
