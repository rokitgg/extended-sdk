/**
 * Interface representing a REST transport.
 *
 * Handles communication with Extended API endpoints.
 *
 * @see {@link https://api.docs.extended.exchange/#public-rest-api | Info endpoint}
 * @see {@link https://api.docs.extended.exchange/#private-rest-api | User endpoint}
 */
export interface IRequestTransport extends Partial<AsyncDisposable> {
	/**
	 * Sends a request to the Extended API.
	 * @param method - The HTTP method to use (GET, POST, etc.).
	 * @param path - The API path (e.g., "info/markets", "info/markets/BTC-USD/stats").
	 * @param params - Query parameters for the request.
	 * @param pathParams - Path parameters to substitute in the URL (e.g., { market: "BTC-USD" }).
	 * @param signal - An optional abort signal.
	 * @returns A promise that resolves with parsed JSON response body.
	 */
	request<T>(
		method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
		path: string,
		params?: Record<string, string | number | boolean | string[]>,
		pathParams?: Record<string, string | number>,
		signal?: AbortSignal,
	): Promise<T>;
}

/**
 * Interface representing an event subscription transport.
 * Handles WebSocket subscriptions for real-time updates.
 * @see {@link https://api.docs.extended.exchange/#public-websocket-streams | Websocket subscriptions}
 */
export interface ISubscriptionTransport extends Partial<AsyncDisposable> {
	/**
	 * Subscribes to a Extended event channel.
	 * @param channel - The event channel to listen to.
	 * @param payload - The payload to send with the subscription request.
	 * @param listener - The function to call when the event is dispatched.
	 * @returns A promise that resolves with a {@link Subscription} object to manage the subscription lifecycle.
	 */
	subscribe<T>(
		channel: string,
		payload: unknown,
		listener: (data: CustomEvent<T>) => void,
	): Promise<Subscription>;
}

/** Controls event subscription lifecycle. */
export interface Subscription {
	/** Unsubscribes from the event and sends an unsubscribe request to the server. */
	unsubscribe(): Promise<void>;
	/** Signal that aborts when resubscription fails during reconnection. */
	resubscribeSignal?: AbortSignal;
}
