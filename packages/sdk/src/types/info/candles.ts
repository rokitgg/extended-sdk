import type { GeneralErrorCode } from "../errors";

/**
 * Get Candles History
 * @see https://api.docs.extended.exchange/#get-candles-history
 */

/** Individual candle data point */
export interface Candle {
	/** Open price */
	o: string;
	/** Close price */
	c: string;
	/** Highest price */
	h: string;
	/** Lowest price */
	l: string;
	/** Trading volume (Only for trades candles) */
	v: string;
	/** Starting timestamp (in epoch milliseconds) for the candle */
	T: number;
}

/** Response interface for candles endpoint */
export type GetCandlesHistoryResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Array of candle data points */
			data: Candle[];
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
