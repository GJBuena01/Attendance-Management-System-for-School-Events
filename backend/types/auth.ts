export interface StudentRecord {
	studentId: string;
	fullName: string;
	email: string;
	password: string;
}

export interface StudentResponse {
	role: "student";
	studentId: string;
	fullName: string;
	email: string;
}
