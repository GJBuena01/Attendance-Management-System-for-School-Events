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

export type AttendanceRecord = {
  id: number;
  eventId: number;
  studentId: string;
  fullName: string;
  scannedBy: string;
  status: 'present';
  scannedAt: string;
};

export type StudentAttendanceRecord = Omit<AttendanceRecord, 'studentId' | 'fullName'> & {
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
};

export type Account = {
  role: UserRole;
  studentId?: string;
  fullName: string;
  email: string;
};
