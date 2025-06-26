import type {
	ExtendedErrorResponse,
	GeneralErrorCode,
	MarketAssetAccountErrorCode,
} from "../errors";

/** Market statuses */
export type MarketStatus =
	| "ACTIVE"
	| "REDUCE_ONLY"
	| "DELISTED"
	| "PRELISTED"
	| "DISABLED";

/** Trade side types */
export type TradeSide = "BUY" | "SELL";

/** Trade type categories */
export type TradeType = "TRADE" | "LIQUIDATION" | "DELEVERAGE";

/** Auto Deleveraging (ADL) level for positions */
export interface DeleverageLevel {
	/** ADL level ranging from 1 (lowest risk) to 4 (highest risk) */
	level: number;
	/** Ranking lower bound for the ADL level */
	rankingLowerBound: string;
}

/** Auto Deleveraging levels for both long and short positions */
export interface DeleverageLevels {
	/** ADL levels for short positions */
	shortPositions: DeleverageLevel[];
	/** ADL levels for long positions */
	longPositions: DeleverageLevel[];
}

/** Order book entry with quantity and price */
export interface OrderBookEntry {
	/** Quantity for the price level */
	qty: string;
	/** Price level */
	price: string;
}

/** Individual trade data */
export interface MarketTrade {
	/** Trade ID */
	i: number;
	/** Market name */
	m: string;
	/** Side of taker trades. Can be BUY or SELL */
	S: TradeSide;
	/** Trade type. Can be TRADE, LIQUIDATION or DELEVERAGE */
	tT: TradeType;
	/** Timestamp (in epoch milliseconds) when the trade happened */
	T: number;
	/** Trade price */
	p: string;
	/** Trade quantity in base asset */
	q: string;
}

/** Trading configuration parameters for the market */
export interface TradingConfig {
	/** Minimum order size for the market */
	minOrderSize: string;
	/** Minimum order size change for the market */
	minOrderSizeChange: string;
	/** Minimum price change for the market */
	minPriceChange: string;
	/** Maximum market order value for the market */
	maxMarketOrderValue: string;
	/** Maximum limit order value for the market */
	maxLimitOrderValue: string;
	/** Maximum position value for the market */
	maxPositionValue: string;
	/** Maximum leverage available for the market */
	maxLeverage: string;
	/** Maximum number of open orders for the market */
	maxNumOrders: string;
	/** Limit order price cap */
	limitPriceCap: string;
	/** Limit order floor ratio */
	limitPriceFloor: string;
}

/** Layer 2 configuration for StarkEx integration */
export interface L2Config {
	/** Type of Layer 2 solution. Currently, only 'STARKX' is supported */
	type: "STARKX";
	/** StarkEx collateral asset ID */
	collateralId: string;
	/** Collateral asset resolution, the number of quantums (StarkEx units) that fit within one "human-readable" unit of the collateral asset */
	collateralResolution: number;
	/** StarkEx synthetic asset ID */
	syntheticId: string;
	/** Synthetic asset resolution, the number of quantums (StarkEx units) that fit within one "human-readable" unit of the synthetic asset */
	syntheticResolution: number;
}

/**
 * Get Markets
 * @see https://api.docs.extended.exchange/?utm_source=chatgpt.com#get-markets
 *
 */

/** Extended market statistics for the enhanced markets endpoint */
export interface MarketStats {
	/** Trading volume of the market in the previous 24 hours in the collateral asset */
	dailyVolume: string;
	/** Trading volume of the market in the previous 24 hours in the base asset */
	dailyVolumeBase: string;
	/** Absolute price change of the last trade price over the past 24 hours */
	dailyPriceChange?: string;
	/** Percent price change of the last trade price over the past 24 hours */
	dailyPriceChangePercentage: string;
	/** Lowest trade price over the past 24 hours */
	dailyLow: string;
	/** Highest trade price over the past 24 hours */
	dailyHigh: string;
	/** Last price of the market */
	lastPrice: string;
	/** Current best ask price of the market */
	askPrice: string;
	/** Current best bid price of the market */
	bidPrice: string;
	/** Current mark price of the market */
	markPrice: string;
	/** Current index price of the market */
	indexPrice: string;
	/** Current funding rate, calculated every minute */
	fundingRate: string;
	/** Timestamp of the next funding update */
	nextFundingRate: number;
	/** Open interest in collateral asset */
	openInterest: string;
	/** Open interest in base asset */
	openInterestBase: string;
}

/** Extended market data with comprehensive information */
export interface ExtendedMarketData {
	/** Name of the market */
	name: string;
	/** Name of the base asset */
	assetName: string;
	/** Number of decimals for the base asset */
	assetPrecision: number;
	/** Name of the collateral asset */
	collateralAssetName: string;
	/** Number of decimals for the collateral asset */
	collateralAssetPrecision: number;
	/** Indicates if the market is currently active. Can be true or false */
	active: boolean;
	/** Market status */
	status: MarketStatus;
	/** Market statistics including volume, prices, and funding rates */
	marketStats: MarketStats;
	/** Trading configuration parameters */
	tradingConfig: TradingConfig;
	/** Layer 2 configuration for StarkEx */
	l2Config: L2Config;
}

/** Response interface for the extended markets API endpoint */
export type GetExtendedMarketsResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Array of extended market data */
			data: ExtendedMarketData[];
	  }
	| {
			/** Response status - "ERROR" for error responses */
			status: "ERROR";
			/** Error details */
			error: {
				/** Error code from the Extended API */
				code: MarketErrorCode;
				/** Descriptive error message */
				message: string;
			};
	  };

/**
 * Get Market Statistics
 * @see https://api.docs.extended.exchange/?utm_source=chatgpt.com#get-market-statistics
 */

/** Market statistics with deleverage levels for individual market stats endpoint */
export interface MarketStatsWithDeleverage extends MarketStats {
	/** Absolute price change of the last trade price over the past 24 hours */
	dailyPriceChange: string;
	/** Auto Deleveraging (ADL) levels for long and short positions */
	deleverageLevels: DeleverageLevels;
}

/** Response interface for individual market statistics endpoint */
export type GetMarketStatsResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Market statistics data with deleverage levels */
			data: MarketStatsWithDeleverage;
	  }
	| {
			/** Response status - "ERROR" for error responses */
			status: "ERROR";
			/** Error details */
			error: {
				/** Error code from the Extended API */
				code: MarketErrorCode;
				/** Descriptive error message */
				message: string;
			};
	  };

/**
 * Get Market Order Book
 * @see https://api.docs.extended.exchange/?utm_source=chatgpt.com#get-market-order-book
 */

/** Market order book structure */
export interface MarketOrderBook {
	/** Market name */
	market: string;
	/** List of bid orders */
	bid: OrderBookEntry[];
	/** List of ask orders */
	ask: OrderBookEntry[];
}

/** Response interface for market order book endpoint */
export type GetMarketOrderBookResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Market order book data */
			data: MarketOrderBook;
	  }
	| {
			/** Response status - "ERROR" for error responses */
			status: "ERROR";
			/** Error details */
			error: {
				/** Error code from the Extended API */
				code: MarketErrorCode;
				/** Descriptive error message */
				message: string;
			};
	  };

/**
 * Get Market Last Trades
 * @see https://api.docs.extended.exchange/?utm_source=chatgpt.com#get-market-last-trades
 */

/** Response interface for market trades endpoint */
export type GetMarketTradesResponse =
	| {
			/** Response status - "OK" for successful responses */
			status: "OK";
			/** Array of market trades */
			data: MarketTrade[];
	  }
	| {
			/** Response status - "ERROR" for error responses */
			status: "ERROR";
			/** Error details */
			error: {
				/** Error code from the Extended API */
				code: MarketErrorCode;
				/** Descriptive error message */
				message: string;
			};
	  };

/**
 * Market-specific error codes that can be returned by market endpoints
 */
export type MarketErrorCode = GeneralErrorCode | MarketAssetAccountErrorCode;

/** Union type for market endpoint responses that can be either success or error */
export type MarketEndpointResponse<T> = T | ExtendedErrorResponse;
