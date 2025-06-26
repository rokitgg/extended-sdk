import type { GeneralErrorCode } from "../errors";

/**
 * Get Funding Rates History
 * @see https://api.docs.extended.exchange/#get-funding-rates-history
 */

/** Individual funding rate data point */
export interface FundingRate {
	/** Name of the requested market */
	m: string;
	/** Timestamp (in epoch milliseconds) when the funding rate was calculated and applied */
	T: number;
	/** Funding rates used for funding fee payments */
	f: string;
}

/** Pagination information for funding rates response */
export interface FundingPagination {
	/** Current cursor for pagination */
	cursor: number;
	/** Count of items in the current response */
	count: number;
}

/** Response interface for funding rates endpoint */
export type GetFundingRatesHistoryResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Array of funding rate data points */
			data: FundingRate[];
			/** Pagination information */
			pagination: FundingPagination;
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
