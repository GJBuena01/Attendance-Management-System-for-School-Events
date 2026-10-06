export interface EventRecord {
	id: number;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
	hasAmAttendance: boolean;
	hasPmAttendance: boolean;
	createdAt: string;
}

export interface CreateEventInput {
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
	hasAmAttendance: boolean;
	hasPmAttendance: boolean;
}

export interface AttendanceRecord {
	id: number;
	studentId: string;
	eventId: string;
	scannedBy: string;
	status: "present";
	scannedAt: string;
}