const normalizeNamePart = (value: string): string =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/,/g, " ")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim()
		.replace(/\s+/g, " ");

export const normalizeOfficerName = (givenName: string, lastName: string): string =>
	`${normalizeNamePart(givenName)} ${normalizeNamePart(lastName)}`.trim();

export const getCorrectedGoogleName = (givenName: string, familyName: string) => {
	const correctedGivenName = familyName.replace(/,/g, " ").trim();
	const correctedLastName = givenName.replace(/,/g, " ").trim();

	return {
		givenName: correctedGivenName,
		lastName: correctedLastName,
		fullName: `${correctedGivenName} ${correctedLastName}`.trim(),
		matchingName: normalizeOfficerName(correctedGivenName, correctedLastName),
	};
};

export const getStudentIdFromEmail = (email: string): string | undefined => {
	const match = /^\w\.([a-z]+(?:[a-z]+)*)\.(\d{6})\.tc@umindanao\.edu\.ph$/i.exec(email);
	return match?.[2];
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();