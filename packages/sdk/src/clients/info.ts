import { InvalidInputError } from "../errors/base";
import type { Candle } from "../schemas/info/market/candles";
import type { FundingRate, Pagination } from "../schemas/info/market/funding";
import type { OpenInterest } from "../schemas/info/market/oi";
import type { MarketStatsWithDeleverage as MarketStats } from "../schemas/info/market/stats";
import type { GetMarketStatsResponse } from "../schemas/info/market/stats";
import type {
	GetMarketTradesResponse,
	MarketTrade,
} from "../schemas/info/market/trades";
import type { GetExtendedMarketsResponse } from "../schemas/info/markets";
import type { IRequestTransport } from "../transports/base";
import type { GetCandlesHistoryResponse } from "../types/info/candles";
import type { GetMarketOrderBookResponse } from "../types/info/markets";
import type {
	ExtendedMarketData,
	MarketOrderBook,
} from "../types/info/markets";

/** Parameters for the {@linkcode InfoClient} constructor. */
export interface InfoClientParameters<
	T extends IRequestTransport = IRequestTransport,
> {
	/** The transport used to connect to the Extended API. */
	transport: T;
}

/**
 * Info client for interacting with the Extended API.
 * @typeParam T The type of transport used to connect to the Extended API.
 */
export class InfoClient<T extends IRequestTransport = IRequestTransport>
	implements InfoClientParameters<T>
{
	transport: T;

	/**
	 * Initialises a new instance.
	 * @param args - The arguments for initialisation.
	 *
	 * @example
	 * ```ts
	 * import { HttpTransport } from "@extended/core/transports";
	 * import { InfoClient } from "@extended/core/clients";
	 *
	 * const transport = new HttpTransport();
	 * const infoClient = new InfoClient({ transport });
	 * ```
	 */
	constructor(args: InfoClientParameters<T>) {
		this.transport = args.transport;
	}

	/**
	 * Markets Endpoint
	 * Get a list of available markets, their configurations, and trading statistics.
	 * @param args - Optional parameters for filtering markets.
	 * @param signal - An optional abort signal.
	 * @returns Array of market data.
	 *
	 * @see https://api.docs.extended.exchange/#get-markets
	 * @example
	 * ```ts
	 * import { HttpTransport } from "@extended/core/transports";
	 * import { InfoClient } from "@extended/core/clients";
	 *
	 * const transport = new HttpTransport();
	 * const infoClient = new InfoClient({ transport });
	 *
	 * // Get all markets
	 * const allMarkets = await infoClient.markets();
	 *
	 * // Get specific market (using query parameters)
	 * const btcMarket = await infoClient.markets({ market: "BTC-USD" });
	 *
	 * // Get multiple markets (using query parameters)
	 * const markets = await infoClient.markets({ market: ["BTC-USD", "ETH-USD"] });
	 * ```
	 */
	async markets(
		args?: { market?: string | string[] },
		signal?: AbortSignal,
	): Promise<ExtendedMarketData[]> {
		const params: Record<string, string | string[]> = {};

		if (args?.market) {
			params.market = args.market;
		}

		const response = await this.transport.request<GetExtendedMarketsResponse>(
			"GET",
			"info/markets",
			params,
			undefined, // No path parameters for this endpoint
			signal,
		);

		// Handle success responses
		if (response.status === "OK") {
			return response.data;
		}

		// Handle error responses
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}

		// Handle unexpected response format
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Market Stats Endpoint
	 * @description Get the latest trading statistics for an individual market.
	 * @note The returned funding rate represents the most recent funding rate, which is calculated every minute.
	 * @param market - Name of the requested market.
	 * @param signal - An optional abort signal.
	 * @returns An object containing the market statistics.
	 *
	 * @see https://api.docs.extended.exchange/#get-market-statistics
	 * @example
	 * ```ts
	 * import { HttpTransport } from "@extended/core/transports";
	 * import { InfoClient } from "@extended/core/clients";
	 *
	 * const transport = new HttpTransport();
	 * const infoClient = new InfoClient({ transport });
	 *
	 * // Get market stats for a specific market (using dynamic route)
	 * const btcStats = await infoClient.marketStats("BTC-USD");
	 * ```
	 */
	async marketStats(
		market: string,
		signal?: AbortSignal,
	): Promise<MarketStats> {
		// Allow only capital letters and hyphens, no numbers or spaces allowed
		if (!market || !market.match(/^[A-Z-]+$/)) {
			throw new InvalidInputError("Invalid market input.");
		}

		const response = await this.transport.request<GetMarketStatsResponse>(
			"GET",
			"info/markets/{market}/stats",
			undefined, // No query parameters for this endpoint
			{ market }, // Path parameters
			signal,
		);

		// Handle success responses
		if (response.status === "OK") {
			return response.data;
		}

		// Handle error responses
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}

		// Handle unexpected response format
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Market Order Book Endpoint
	 * @description Get the latest orderbook for an individual market.
	 * @param market - Name of the requested market.
	 * @param signal - An optional abort signal.
	 * @returns An object containing the market order book data.
	 *
	 * @see https://api.docs.extended.exchange/#get-market-orderbook
	 * @example
	 * ```ts
	 * import { HttpTransport } from "@extended/core/transports";
	 * import { InfoClient } from "@extended/core/clients";
	 *
	 * const transport = new HttpTransport();
	 * const infoClient = new InfoClient({ transport });
	 *
	 * // Get order book for a specific market
	 * const orderBook = await infoClient.marketOrderBook("BTC-USD");
	 * console.log(orderBook.bid); // Array of bid orders
	 * console.log(orderBook.ask); // Array of ask orders
	 * ```
	 */
	async marketOrderBook(
		market: string,
		signal?: AbortSignal,
	): Promise<MarketOrderBook | undefined> {
		const response = await this.transport.request<GetMarketOrderBookResponse>(
			"GET",
			"info/markets/{market}/orderbook",
			undefined, // No query parameters for this endpoint
			{ market }, // Path parameters
			signal,
		);

		// Handle success responses
		if (response.status === "OK") {
			return response.data;
		}

		// Handle error responses
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}

		// Handle unexpected response format
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Market Last Trades Endpoint
	 * @description Get the latest trades for an individual market.
	 * @param market - Name of the requested market.
	 * @param signal - An optional abort signal.
	 * @returns An array of market trades.
	 *
	 * @see https://api.docs.extended.exchange/#get-market-last-trades
	 * @example
	 * ```ts
	 * import { HttpTransport } from "@extended/core/transports";
	 * import { InfoClient } from "@extended/core/clients";
	 *
	 * const transport = new HttpTransport();
	 * const infoClient = new InfoClient({ transport });
	 *
	 * // Get latest trades for a specific market
	 * const trades = await infoClient.marketTrades("BTC-USD");
	 * console.log(trades[0].p); // Trade price
	 * console.log(trades[0].q); // Trade quantity
	 * console.log(trades[0].S); // Trade side (BUY/SELL)
	 * ```
	 */
	async marketTrades(
		market: string,
		signal?: AbortSignal,
	): Promise<MarketTrade[]> {
		// Allow only capital letters and hyphens, no numbers or spaces allowed
		if (!market || !market.match(/^[A-Z-]+$/)) {
			throw new InvalidInputError("Invalid market input.");
		}

		const response = await this.transport.request<GetMarketTradesResponse>(
			"GET",
			"info/markets/{market}/trades",
			undefined, // No query parameters for this endpoint
			{ market }, // Path parameters
			signal,
		);

		// Handle success responses
		if (response.status === "OK") {
			return response.data;
		}

		// Handle error responses
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}

		// Handle unexpected response format
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Candles History Endpoint
	 * @description Get the candles history for an individual market and price type.
	 * @param market - Name of the requested market.
	 * @param candleType - Price type: "trades", "mark-prices", or "index-prices".
	 * @param interval - The time interval between data points (required).
	 * @param limit - The maximum number of items to return (required).
	 * @param endTime - Optional end timestamp (in epoch milliseconds).
	 * @param signal - An optional abort signal.
	 * @returns Array of candle data points.
	 *
	 * @see https://api.docs.extended.exchange/#get-candles-history
	 * @example
	 * ```ts
	 * const candles = await infoClient.candles("BTC-USD", "trades", "1m", 1000);
	 * ```
	 */
	async candles(
		market: string,
		candleType: "trades" | "mark-prices" | "index-prices",
		interval: string,
		limit: number,
		endTime?: number,
		signal?: AbortSignal,
	): Promise<Candle[]> {
		if (!market || !market.match(/^[A-Z-]+$/)) {
			throw new InvalidInputError("Invalid market input.");
		}
		if (!interval) {
			throw new InvalidInputError("Interval is required.");
		}
		if (!limit || limit <= 0) {
			throw new InvalidInputError("Limit must be a positive number.");
		}
		if (!candleType.match(/^(trades|mark-prices|index-prices)$/)) {
			throw new InvalidInputError("Invalid candleType.");
		}

		const params: Record<string, string | number> = { interval, limit };
		if (endTime !== undefined) {
			params.endTime = endTime;
		}

		const response = await this.transport.request<GetCandlesHistoryResponse>(
			"GET",
			`info/candles/{market}/{candleType}`,
			params,
			{ market, candleType },
			signal,
		);

		if (response.status === "OK") {
			return response.data;
		}
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Funding History Endpoint
	 * @description Get the funding rates history for an individual market for the timeframe specified in the request.
	 * @param market - Name of the requested market.
	 * @param startTime - Starting timestamp (in epoch milliseconds) for the requested period.
	 * @param endTime - Ending timestamp (in epoch milliseconds) for the requested period.
	 * @param cursor - Optional cursor for pagination.
	 * @param limit - Optional maximum number of items to return.
	 * @param signal - An optional abort signal.
	 * @returns Object containing funding rate data and pagination information.
	 *
	 * @see https://api.docs.extended.exchange/#get-funding-rates-history
	 * @example
	 * ```ts
	 * const fundingHistory = await infoClient.funding("BTC-USD", startTime, endTime);
	 * console.log(fundingHistory.data); // Array of funding rates
	 * console.log(fundingHistory.pagination); // Pagination info
	 * ```
	 */
	async funding(
		market: string,
		startTime: number,
		endTime: number,
		cursor?: number,
		limit?: number,
		signal?: AbortSignal,
	): Promise<{ data: FundingRate[]; pagination: Pagination }> {
		if (!market || !market.match(/^[A-Z-]+$/)) {
			throw new InvalidInputError("Invalid market input.");
		}
		if (!startTime || startTime <= 0) {
			throw new InvalidInputError("Start time must be a positive number.");
		}
		if (!endTime || endTime <= 0) {
			throw new InvalidInputError("End time must be a positive number.");
		}
		if (startTime >= endTime) {
			throw new InvalidInputError("Start time must be before end time.");
		}
		if (limit !== undefined && (limit <= 0 || limit > 10000)) {
			throw new InvalidInputError("Limit must be between 1 and 10000.");
		}

		const params: Record<string, string | number> = { startTime, endTime };
		if (cursor !== undefined) {
			params.cursor = cursor;
		}
		if (limit !== undefined) {
			params.limit = limit;
		}

		const response = await this.transport.request<
			| {
					status: "OK";
					data: FundingRate[];
					pagination?: Pagination;
			  }
			| {
					status: "ERROR";
					error: { code: string; message: string };
			  }
		>("GET", "info/{market}/funding", params, { market }, signal);

		if (response.status === "OK") {
			return {
				data: response.data,
				pagination: response.pagination || {
					cursor: 0,
					count: response.data.length,
				},
			};
		}
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}

	/**
	 * Open Interest History Endpoint
	 * @description Get the open interest history for an individual market for the timeframe specified in the request.
	 * @param market - Name of the requested market.
	 * @param interval - Time interval: "P1H" for hour or "P1D" for day.
	 * @param startTime - Starting timestamp (in epoch milliseconds) for the requested period.
	 * @param endTime - Ending timestamp (in epoch milliseconds) for the requested period.
	 * @param limit - Optional maximum number of items to return.
	 * @param signal - An optional abort signal.
	 * @returns Array of open interest data points.
	 *
	 * @see https://api.docs.extended.exchange/#get-open-interest-history
	 * @example
	 * ```ts
	 * const openInterest = await infoClient.openInterest("BTC-USD", "P1D", startTime, endTime);
	 * ```
	 */
	async openInterest(
		market: string,
		interval: "P1H" | "P1D",
		startTime: number,
		endTime: number,
		limit?: number,
		signal?: AbortSignal,
	): Promise<OpenInterest[]> {
		if (!market || !market.match(/^[A-Z-]+$/)) {
			throw new InvalidInputError("Invalid market input.");
		}
		if (!interval || !interval.match(/^(P1H|P1D)$/)) {
			throw new InvalidInputError("Interval must be P1H or P1D.");
		}
		if (!startTime || startTime <= 0) {
			throw new InvalidInputError("Start time must be a positive number.");
		}
		if (!endTime || endTime <= 0) {
			throw new InvalidInputError("End time must be a positive number.");
		}
		if (startTime >= endTime) {
			throw new InvalidInputError("Start time must be before end time.");
		}
		if (limit !== undefined && (limit <= 0 || limit > 300)) {
			throw new InvalidInputError("Limit must be between 1 and 300.");
		}

		const params: Record<string, string | number> = {
			interval,
			startTime,
			endTime,
		};
		if (limit !== undefined) {
			params.limit = limit;
		}

		const response = await this.transport.request<
			| {
					status: "OK";
					data: OpenInterest[];
			  }
			| {
					status: "ERROR";
					error: { code: string; message: string };
			  }
		>("GET", "info/{market}/open-interests", params, { market }, signal);

		if (response.status === "OK") {
			return response.data;
		}
		if (response.status === "ERROR") {
			throw new Error(
				`API Error: ${response.error.code} - ${response.error.message}`,
			);
		}
		throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
	}
}
