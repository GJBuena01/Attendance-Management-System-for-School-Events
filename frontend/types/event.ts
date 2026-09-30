export type UserRole = 'student' | 'officer';

export type EventRecord = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  hasAmAttendance: boolean;
  hasPmAttendance: boolean;
  createdAt: string;
};

export type CreateEventInput = Omit<EventRecord, 'id' | 'createdAt'>;
