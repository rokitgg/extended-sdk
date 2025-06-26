import { z } from "zod";
import {
	GeneralErrorCodeSchema,
	MarketAssetAccountErrorCodeSchema,
} from "../errors";
import { MarketStatsSchema } from "./market/stats";

// Market statuses
export const MarketStatusSchema = z.enum([
	"ACTIVE",
	"REDUCE_ONLY",
	"DELISTED",
	"PRELISTED",
	"DISABLED",
]);

// Market-specific error codes that can be returned by market endpoints
export const MarketErrorCodeSchema = z.union([
	GeneralErrorCodeSchema,
	MarketAssetAccountErrorCodeSchema,
]);

// Trade side types
export const TradeSideSchema = z.enum(["BUY", "SELL"]);

// Trade type categories
export const TradeTypeSchema = z.enum(["TRADE", "LIQUIDATION", "DELEVERAGE"]);

// Individual trade data
export const MarketTradeSchema = z.object({
	/** Trade ID */
	i: z.number().int(),
	/** Market name */
	m: z.string(),
	/** Side of taker trades. Can be BUY or SELL */
	S: TradeSideSchema,
	/** Trade type. Can be TRADE, LIQUIDATION or DELEVERAGE */
	tT: TradeTypeSchema,
	/** Timestamp (in epoch milliseconds) when the trade happened */
	T: z.number().int().positive(),
	/** Trade price */
	p: z.string(),
	/** Trade quantity in base asset */
	q: z.string(),
});

// Trading configuration parameters for the market
export const TradingConfigSchema = z.object({
	/** Minimum order size for the market */
	minOrderSize: z.string(),
	/** Minimum order size change for the market */
	minOrderSizeChange: z.string(),
	/** Minimum price change for the market */
	minPriceChange: z.string(),
	/** Maximum market order value for the market */
	maxMarketOrderValue: z.string(),
	/** Maximum limit order value for the market */
	maxLimitOrderValue: z.string(),
	/** Maximum position value for the market */
	maxPositionValue: z.string(),
	/** Maximum leverage available for the market */
	maxLeverage: z.string(),
	/** Maximum number of open orders for the market */
	maxNumOrders: z.string(),
	/** Limit order price cap */
	limitPriceCap: z.string(),
	/** Limit order floor ratio */
	limitPriceFloor: z.string(),
});

// Layer 2 configuration for StarkEx integration
export const L2ConfigSchema = z.object({
	/** Type of Layer 2 solution. Currently, only 'STARKX' is supported */
	type: z.literal("STARKX"),
	/** StarkEx collateral asset ID */
	collateralId: z.string(),
	/** Collateral asset resolution, the number of quantums (StarkEx units) that fit within one "human-readable" unit of the collateral asset */
	collateralResolution: z.number().int().positive(),
	/** StarkEx synthetic asset ID */
	syntheticId: z.string(),
	/** Synthetic asset resolution, the number of quantums (StarkEx units) that fit within one "human-readable" unit of the synthetic asset */
	syntheticResolution: z.number().int().positive(),
});

// Extended market data with comprehensive information
export const ExtendedMarketDataSchema = z.object({
	/** Name of the market */
	name: z.string(),
	/** Name of the base asset */
	assetName: z.string(),
	/** Number of decimals for the base asset */
	assetPrecision: z.number().int().min(0),
	/** Name of the collateral asset */
	collateralAssetName: z.string(),
	/** Number of decimals for the collateral asset */
	collateralAssetPrecision: z.number().int().min(0),
	/** Indicates if the market is currently active. Can be true or false */
	active: z.boolean(),
	/** Market status */
	status: MarketStatusSchema,
	/** Market statistics including volume, prices, and funding rates */
	marketStats: MarketStatsSchema,
	/** Trading configuration parameters */
	tradingConfig: TradingConfigSchema,
	/** Layer 2 configuration for StarkEx */
	l2Config: L2ConfigSchema,
	/** Visible in the UI */
	visibleOnUi: z.boolean(),
	/** Creation timestamp */
	createdAt: z.number().int().positive(),
});

// Response schemas with discriminated unions
export const GetExtendedMarketsSuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Array of extended market data */
	data: z.array(ExtendedMarketDataSchema),
});

export const GetExtendedMarketsErrorSchema = z.object({
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

export const GetExtendedMarketsResponseSchema = z.discriminatedUnion("status", [
	GetExtendedMarketsSuccessSchema,
	GetExtendedMarketsErrorSchema,
]);

export type GetExtendedMarketsResponse = z.infer<
	typeof GetExtendedMarketsResponseSchema
>;

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
