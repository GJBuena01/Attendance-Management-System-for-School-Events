export interface AttendanceRecord {
	id: number;
	studentId: string;
	eventId: string;
	scannedBy: string;
	status: string;
	scannedAt: string;
}

export interface StudentAttendanceRecord {
	id: number;
	eventId: string;
	scannedBy: string;
	status: string;
	scannedAt: string;
}
