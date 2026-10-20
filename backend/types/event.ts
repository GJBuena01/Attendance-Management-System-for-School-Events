export interface EventRecord {
	id: number;
	name: string;
	description: string | null;
	startDate: string;
	endDate: string;
	location: string;
	createdAt: string;
	status: "starting_soon" | "ongoing" | "ended";
	archivedAt: string | null;
	archivedBy: string | null;
}

export interface CreateEventInput {
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
}
