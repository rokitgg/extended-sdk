import { TransportError } from "./transport";

/**
 * Error thrown when an HTTP response is deemed invalid:
 * - Non-200 status code
 * - Unexpected content type
 */
export class HttpRequestError extends TransportError {
	/**
	 * Creates a new HTTP request error.
	 * @param response - The failed HTTP response.
	 * @param responseBody - The raw response body content, if available.
	 */
	constructor(
		public response: Response,
		public responseBody?: string,
	) {
		let message = `HTTP request failed: status ${response.status}`;
		if (responseBody) message += `, body "${responseBody}"`;

		super(message);
		this.name = "HttpRequestError";
	}
}
