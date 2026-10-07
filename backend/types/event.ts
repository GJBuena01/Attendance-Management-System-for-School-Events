export interface EventRecord {
	id: number;
	name: string;
	description: string | null;
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
