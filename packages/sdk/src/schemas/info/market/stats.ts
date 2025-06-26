import { z } from "zod";
import { MarketErrorCodeSchema } from "../markets";

// Extended market statistics schema
export const MarketStatsSchema = z.object({
	/** Trading volume of the market in the previous 24 hours in the collateral asset */
	dailyVolume: z.string(),
	/** Trading volume of the market in the previous 24 hours in the base asset */
	dailyVolumeBase: z.string(),
	/** Absolute price change of the last trade price over the past 24 hours */
	dailyPriceChange: z.string().optional(),
	/** Percent price change of the last trade price over the past 24 hours */
	dailyPriceChangePercentage: z.string(),
	/** Lowest trade price over the past 24 hours */
	dailyLow: z.string(),
	/** Highest trade price over the past 24 hours */
	dailyHigh: z.string(),
	/** Last price of the market */
	lastPrice: z.string(),
	/** Current best ask price of the market */
	askPrice: z.string(),
	/** Current best bid price of the market */
	bidPrice: z.string(),
	/** Current mark price of the market */
	markPrice: z.string(),
	/** Current index price of the market */
	indexPrice: z.string(),
	/** Current funding rate, calculated every minute */
	fundingRate: z.string(),
	/** Timestamp of the next funding update */
	nextFundingRate: z.number().int().positive(),
	/** Open interest in collateral asset */
	openInterest: z.string(),
	/** Open interest in base asset */
	openInterestBase: z.string(),
});

// Auto Deleveraging (ADL) level for positions
export const DeleverageLevel = z.object({
	/** ADL level ranging from 1 (lowest risk) to 4 (highest risk) */
	level: z.number().int().min(1).max(4),
	/** Ranking lower bound for the ADL level */
	rankingLowerBound: z.string(),
});

// Auto Deleveraging levels for both long and short positions
export const DeleverageLevelsSchema = z.object({
	/** ADL levels for short positions */
	shortPositions: z.array(DeleverageLevel),
	/** ADL levels for long positions */
	longPositions: z.array(DeleverageLevel),
});

// Market statistics with deleverage levels for individual market stats endpoint
export const MarketStatsWithDeleverageSchema = MarketStatsSchema.extend({
	/** Absolute price change of the last trade price over the past 24 hours */
	dailyPriceChange: z.string(),
	/** Auto Deleveraging (ADL) levels for long and short positions */
	deleverageLevels: DeleverageLevelsSchema,
});

export const GetMarketStatsSuccessSchema = z.object({
	/** Response status - "OK" for successful responses */
	status: z.literal("OK"),
	/** Market statistics data with deleverage levels */
	data: MarketStatsWithDeleverageSchema,
});

export const GetMarketStatsErrorSchema = z.object({
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

export const GetMarketStatsResponseSchema = z.discriminatedUnion("status", [
	GetMarketStatsSuccessSchema,
	GetMarketStatsErrorSchema,
]);

export type GetMarketStatsResponse = z.infer<
	typeof GetMarketStatsResponseSchema
>;
export type MarketStatsWithDeleverage = z.infer<
	typeof MarketStatsWithDeleverageSchema
>;
