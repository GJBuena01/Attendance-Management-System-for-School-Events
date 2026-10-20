export interface StudentRecord {
	studentId: string;
	givenName: string;
	lastName: string;
	fullName: string;
	email: string;
	googleSubject: string;
}

export interface StudentResponse {
	role: "student" | "officer";
	studentId: string;
	givenName: string;
	lastName: string;
	fullName: string;
	email: string;
}

export interface GoogleIdentity {
	subject: string;
	email: string;
	givenName: string;
	familyName: string;
}

export interface OfficerRecord {
	id: number;
	givenName: string;
	lastName: string;
	matchingName: string;
	studentId?: string;
}
