const isoDateTimePattern =
	/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2}))?$/;

export function normalizeIsoDateTime(value: string): string | undefined {
	const match = isoDateTimePattern.exec(value);
	if (!match) {
		return undefined;
	}

	const [, yearText, monthText, dayText, hourText, minuteText, secondText, , zone] =
		match;
	const year = Number(yearText);
	const month = Number(monthText);
	const day = Number(dayText);
	const hour = Number(hourText ?? 0);
	const minute = Number(minuteText ?? 0);
	const second = Number(secondText ?? 0);
	const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const daysInMonth = [
		31,
		leapYear ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	][month - 1];

	if (
		month < 1 ||
		month > 12 ||
		day < 1 ||
		day > daysInMonth ||
		hour > 23 ||
		minute > 59 ||
		second > 59
	) {
		return undefined;
	}

	if (zone && zone !== "Z") {
		const offsetHours = Number(zone.slice(1, 3));
		const offsetMinutes = Number(zone.slice(4, 6));
		if (offsetHours > 23 || offsetMinutes > 59) {
			return undefined;
		}
	}

	const timestamp = Date.parse(
		hourText === undefined ? `${value}T00:00:00.000Z` : value,
	);
	return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

export function normalizeStoredDateTime(value: string): string {
	return normalizeIsoDateTime(value) ?? value;
}
