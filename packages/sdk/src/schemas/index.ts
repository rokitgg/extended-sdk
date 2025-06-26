// Error schemas
export * from "./errors";

// Info schemas - only export markets-specific schemas, not trade schemas
export {
	MarketStatusSchema,
	MarketErrorCodeSchema,
	TradeSideSchema,
	TradeTypeSchema,
	MarketTradeSchema,
	TradingConfigSchema,
	L2ConfigSchema,
	ExtendedMarketDataSchema,
	GetExtendedMarketsSuccessSchema,
	GetExtendedMarketsErrorSchema,
	GetExtendedMarketsResponseSchema,
	type GetExtendedMarketsResponse,
} from "./info/markets";

// Market-specific schemas
export * from "./info/market/book";
export * from "./info/market/candles";
export * from "./info/market/funding";
export * from "./info/market/oi";
export * from "./info/market/stats";
export * from "./info/market/trades";
