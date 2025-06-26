import { z } from "zod";
import { GeneralErrorCodeSchema } from "../../errors";

/** Individual funding rate data point */
export const FundingRateSchema = z.object({
	/** Name of the requested market */
	m: z.string(),
	/** Timestamp (in epoch milliseconds) when the funding rate was calculated and applied */
	T: z.number().int(),
	/** Funding rates used for funding fee payments */
	f: z.string(),
});

/** Pagination information */
export const PaginationSchema = z.object({
	/** Cursor for pagination */
	cursor: z.number().int(),
	/** Number of items returned */
	count: z.number().int(),
});

/** Success response schema for funding history endpoint */
export const GetFundingHistorySuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Array of funding rate data points */
	data: z.array(FundingRateSchema),
	/** Pagination information (optional) */
	pagination: PaginationSchema.optional(),
});

/** Error response schema for funding history endpoint */
export const GetFundingHistoryErrorSchema = z.object({
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

/** Discriminated union for funding history endpoint response */
export const GetFundingResponseSchema = z.discriminatedUnion("status", [
	GetFundingHistorySuccessSchema,
	GetFundingHistoryErrorSchema,
]);

// Type exports
export type FundingRate = z.infer<typeof FundingRateSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
