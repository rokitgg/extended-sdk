import { HttpRequestError } from "../../errors/http";

/** Interface for objects that can be disposed asynchronously */
interface AsyncDisposable {
	dispose(): Promise<void>;
}

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

/** Configuration options for the HTTP transport layer. */
export interface HttpTransportOptions {
	/**
	 * Specifies whether to use the testnet API endpoints.
	 * @defaultValue `false`
	 */
	isTestnet?: boolean;
	/**
	 * Request timeout in ms. Set to `null` to disable.
	 * @defaultValue `10_000`
	 */
	timeout?: number | null;
	/**
	 * Custom server to use for API requests.
	 * @defaultValue `https://api.extended.exchange` for mainnet and `https://api.testnet.extended.exchange` for testnet.
	 */
	server?: {
		mainnet?: {
			api?: string | URL;
			rpc?: string | URL;
		};
		testnet?: {
			api?: string | URL;
			rpc?: string | URL;
		};
	};
	/** A custom {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/RequestInit | RequestInit} that is merged with a fetch request. */
	fetchOptions?: Omit<RequestInit, "body" | "method">;
	/**
	 * A callback function that is called before the request is sent.
	 * @param request - An original request to send.
	 * @returns If returned a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Request/Request | Request}, it will replace the original request.
	 */
	onRequest?: (request: Request) => Promise<Request | void | null | undefined>;
	/**
	 * A callback function that is called after the response is received.
	 * @param response - An original response to process.
	 * @returns If returned a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response/Response | Response}, it will replace the original response.
	 */
	onResponse?: (
		response: Response,
	) => Promise<Response | void | null | undefined>;
}

/** HTTP implementation of the REST transport interface. */
export class HttpTransport implements IRequestTransport, HttpTransportOptions {
	isTestnet: boolean;
	timeout: number | null;
	server: {
		mainnet: {
			api: string | URL;
		};
		testnet: {
			api: string | URL;
		};
	};
	fetchOptions: Omit<RequestInit, "body" | "method">;
	onRequest?: (request: Request) => Promise<Request | void | null | undefined>;
	onResponse?: (
		response: Response,
	) => Promise<Response | void | null | undefined>;

	/**
	 * Creates a new HTTP transport instance.
	 * @param options - Configuration options for the HTTP transport layer.
	 */
	constructor(options?: HttpTransportOptions) {
		this.isTestnet = options?.isTestnet ?? false;
		this.timeout = options?.timeout ?? 10_000;
		this.server = {
			mainnet: {
				api: options?.server?.mainnet?.api ?? "https://app.extended.exchange",
			},
			testnet: {
				api:
					options?.server?.testnet?.api ?? "https://testnet.extended.exchange",
			},
		};
		this.fetchOptions = options?.fetchOptions ?? {};
		this.onRequest = options?.onRequest;
		this.onResponse = options?.onResponse;
	}

	/**
	 * Sends a request to the Extended API via fetch.
	 * @param method - The HTTP method to use.
	 * @param path - The API path.
	 * @param params - Query parameters for the request.
	 * @param pathParams - Path parameters to substitute in the URL (e.g., { market: "BTC-USD" }).
	 * @param signal - An optional abort signal.
	 * @returns A promise that resolves with parsed JSON response body.
	 * @throws {HttpRequestError} - Thrown when an HTTP response is deemed invalid.
	 * @throws May throw {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#exceptions | fetch errors}.
	 */
	async request<T>(
		method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
		path: string,
		params?: Record<string, string | number | boolean | string[]>,
		pathParams?: Record<string, string | number>,
		signal?: AbortSignal,
	): Promise<T> {
		// Apply path parameters to the raw path string first
		let processedPath = path;
		if (pathParams) {
			for (const [key, value] of Object.entries(pathParams)) {
				processedPath = processedPath.replace(`{${key}}`, String(value));
			}
		}

		const baseUrl = this.isTestnet
			? this.server.testnet.api
			: this.server.mainnet.api;
		const url = new URL(`/api/v1/${processedPath}`, baseUrl);

		// Add query parameters
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (Array.isArray(value)) {
					// Handle array parameters (e.g., market=market1&market=market2)
					value.forEach((v) => url.searchParams.append(key, String(v)));
				} else {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const controller = this.timeout ? new AbortController() : null;
		const timeoutId = this.timeout
			? setTimeout(() => controller?.abort(), this.timeout)
			: null;

		try {
			const request = new Request(url, {
				method,
				...this.fetchOptions,
				signal: signal || controller?.signal,
			});

			const modifiedRequest = await this.onRequest?.(request);
			const finalRequest = modifiedRequest || request;

			const response = await fetch(finalRequest);
			const modifiedResponse = await this.onResponse?.(response);
			const finalResponse = modifiedResponse || response;

			if (!finalResponse.ok) {
				let responseBody: string | undefined;
				try {
					responseBody = await finalResponse.text();
				} catch {
					// Ignore error reading response body
				}
				throw new HttpRequestError(finalResponse, responseBody);
			}

			const contentType = finalResponse.headers.get("content-type");
			if (!contentType?.includes("application/json")) {
				throw new HttpRequestError(
					finalResponse,
					`Expected JSON response, got ${contentType}`,
				);
			}

			return finalResponse.json();
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}
	}
}
