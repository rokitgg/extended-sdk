import { ExtendedError } from "./base";

/** Base class for all transport-related errors. */
export class TransportError extends ExtendedError {
	constructor(message?: string) {
		super(message);
		this.name = "TransportError";
	}
}
