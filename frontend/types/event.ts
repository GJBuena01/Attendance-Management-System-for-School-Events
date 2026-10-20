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
  status: 'starting_soon' | 'ongoing' | 'ended';
  archivedAt: string | null;
  archivedBy: string | null;
};

export type CreateEventInput = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  hasAmAttendance: boolean;
  hasPmAttendance: boolean;
};

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
  givenName?: string;
  lastName?: string;
  fullName: string;
  email: string;
};
