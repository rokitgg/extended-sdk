import type { GeneralErrorCode } from "../errors";

/**
 * Get Open Interest History
 * @see https://api.docs.extended.exchange/#get-open-interest-history
 */

/** Individual open interest data point */
export interface OpenInterest {
	/** Open interest in USD */
	i: string;
	/** Open interest in synthetic asset */
	I: string;
	/** Timestamp (in epoch milliseconds) when the open interest was calculated */
	t: number;
}

/** Response interface for open interest endpoint */
export type GetOpenInterestHistoryResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Array of open interest data points */
			data: OpenInterest[];
	  }
	| {
			/** Response status - "ERROR" for error responses */
			status: "ERROR";
			/** Error details */
			error: {
				/** Error code from the Extended API */
				code: GeneralErrorCode;
				/** Descriptive error message */
				message: string;
			};
	  };
