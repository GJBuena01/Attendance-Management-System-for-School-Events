export type AttendanceStatus = 'Present';

export type MockEvent = {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
};

export type AttendanceRecord = {
  id: number;
  eventId: number;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  timestamp: string;
  scannerName: string;
};

export const mockStudent = {
  id: '123456',
  fullName: 'Bryce San Jose',
};

export const mockEvents: MockEvent[] = [
  {
    id: 1,
    name: 'CSIT General Assembly',
    date: 'September 28, 2026',
    location: 'UM Visayan Campus AVR',
    description: 'Welcome assembly for the College of Science and Information Technology.',
  },
  {
    id: 2,
    name: 'Intramurals',
    date: 'September 20, 2026',
    location: 'UM Main Campus',
    description: 'Annual campus sports and activities event.',
  },
  {
    id: 3,
    name: 'Pakikipagsandurot',
    date: 'September 15, 2026',
    location: 'UM Main Campus',
    description: 'A student community gathering.',
  },
  {
    id: 4,
    name: 'Quarterly Riot',
    date: 'September 8, 2026',
    location: 'UM Visayan Grounds',
    description: 'Quarterly student activities and performances.',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 1,
    eventId: 1,
    studentId: mockStudent.id,
    studentName: mockStudent.fullName,
    status: 'Present',
    timestamp: 'September 28, 2026 at 09:14',
    scannerName: 'Officer Gerwin',
  },
  {
    id: 2,
    eventId: 1,
    studentId: '146430',
    studentName: 'Gab Buena',
    status: 'Present',
    timestamp: 'September 28, 2026 at 09:18',
    scannerName: 'Officer Cabal',
  },
  {
    id: 3,
    eventId: 3,
    studentId: mockStudent.id,
    studentName: mockStudent.fullName,
    status: 'Present',
    timestamp: 'September 15, 2026 at 10:02',
    scannerName: 'Officer Ramil',
  },
  {
    id: 4,
    eventId: 4,
    studentId: mockStudent.id,
    studentName: mockStudent.fullName,
    status: 'Present',
    timestamp: 'September 8, 2026 at 08:57',
    scannerName: 'Officer Ramil',
  },
];
