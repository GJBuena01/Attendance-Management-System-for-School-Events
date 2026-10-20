const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDateOnly = (value: string): number | undefined => {
	const match = DATE_ONLY_PATTERN.exec(value);
	if (!match) {
		return undefined;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(0);
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCFullYear(year, month - 1, day);
	const timestamp = date.getTime();

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return undefined;
	}

	return timestamp;
};

export const normalizeEventDate = (
	value: unknown,
	boundary: "start" | "end",
): string | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}

	const normalizedValue = value.trim();
	const dateOnly = parseDateOnly(normalizedValue);
	if (dateOnly !== undefined) {
		const timestamp = boundary === "end" ? dateOnly + MILLISECONDS_PER_DAY - 1 : dateOnly;
		return new Date(timestamp).toISOString();
	}

	if (!ISO_DATETIME_PATTERN.test(normalizedValue)) {
		return undefined;
	}

	if (parseDateOnly(normalizedValue.slice(0, 10)) === undefined) {
		return undefined;
	}

	const timestamp = Date.parse(normalizedValue);
	return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
};

export const normalizeStoredEventDate = (
	value: string,
	boundary: "start" | "end",
): string | undefined => {
	const normalized = normalizeEventDate(value, boundary);
	if (normalized) {
		return normalized;
	}

	const legacyTimestamp = Date.parse(value);
	return Number.isFinite(legacyTimestamp) ? new Date(legacyTimestamp).toISOString() : undefined;
};
