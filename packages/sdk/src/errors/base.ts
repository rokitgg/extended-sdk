/** Base error class for all SDK errors. */
export class ExtendedError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "ExtendedError";
	}
}

export class InvalidInputError extends ExtendedError {
	constructor(message?: string) {
		super(message);
		this.name = "InvalidInputError";
	}
}
