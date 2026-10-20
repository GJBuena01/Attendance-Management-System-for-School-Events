export interface AttendanceRecord {
	id: number;
	studentId: string;
	eventId: number;
	fullName: string;
	scannedBy: string;
	status: "present";
	scannedAt: string;
}

export interface StudentAttendanceRecord extends Omit<AttendanceRecord, "studentId" | "fullName"> {
	eventName: string;
	startDate: string;
	endDate: string;
	location: string;
}

export interface RecordAttendanceInput {
	studentId: string;
	eventId: number;
	scannedBy: string;
}
