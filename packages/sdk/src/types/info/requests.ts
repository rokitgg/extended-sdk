/** Time intervals for candle data */
export type CandleInterval =
	| "1m" // 1 minute
	| "5m" // 5 minutes
	| "15m" // 15 minutes
	| "30m" // 30 minutes
	| "1h" // 1 hour
	| "4h" // 4 hours
	| "1d" // 1 day
	| "1w" // 1 week
	| "1M"; // 1 month

/** Available candle types for the candles endpoint */
export type CandleType = "trades" | "mark-prices" | "index-prices";

/** Query parameters for candles endpoint */
export interface CandlesQueryParams {
	/** The time interval between data points */
	interval: CandleInterval;
	/** The maximum number of items that should be returned */
	limit: number;
	/** End timestamp (in epoch milliseconds) for the requested period */
	endTime?: number;
}

/** URL parameters for candles endpoint */
export interface CandlesUrlParams {
	/** Name of the requested market */
	market: string;
	/** Price type. Can be trades, mark-prices, or index-prices */
	candleType: CandleType;
}

/** Query parameters for funding rates endpoint */
export interface FundingQueryParams {
	/** Starting timestamp (in epoch milliseconds) for the requested period */
	startTime: number;
	/** Ending timestamp (in epoch milliseconds) for the requested period */
	endTime: number;
	/** Determines the offset of the returned result. To get the next result page, you can use the cursor from the pagination section of the previous response */
	cursor?: number;
	/** Maximum number of items that should be returned */
	limit?: number;
}

/** URL parameters for funding rates endpoint */
export interface FundingUrlParams {
	/** Name of the requested market */
	market: string;
}

/** Available intervals for open interest data */
export type OpenInterestInterval = "P1H" | "P1D";

/** Query parameters for open interest endpoint */
export interface OpenInterestQueryParams {
	/** Starting timestamp (in epoch milliseconds) for the requested period */
	startTime: number;
	/** Ending timestamp (in epoch milliseconds) for the requested period */
	endTime: number;
	/** Time interval for the data points. P1H for hour and P1D for day */
	interval: OpenInterestInterval;
	/** Maximum number of items that should be returned */
	limit?: number;
}

/** URL parameters for open interest endpoint */
export interface OpenInterestUrlParams {
	/** Name of the requested market */
	market: string;
}
