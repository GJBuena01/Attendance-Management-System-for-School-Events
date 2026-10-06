export class BackendError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
	) {
		super(message);
	}
}