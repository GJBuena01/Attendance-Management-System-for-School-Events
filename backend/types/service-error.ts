export class ServiceError extends Error {
	constructor(
		public readonly status: number,
		message: string,
		public readonly cause?: unknown,
	) {
		super(message);
		this.name = "ServiceError";
	}
}
