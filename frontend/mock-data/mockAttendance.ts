export type AttendanceStatus = 'Present' | 'Absent';

export type AttendanceRecord = {
  id: number;
  eventName: string;
  date: string;
  status: AttendanceStatus;
};

export const mockAttendance: AttendanceRecord[] = [
  { id: 1, eventName: 'CSIT General Assembly', date: 'September 28, 2026', status: 'Present' },
  { id: 2, eventName: 'Intramurals', date: 'September 20, 2026', status: 'Absent' },
  { id: 3, eventName: 'Pakikipagsandurot', date: 'September 15, 2026', status: 'Present' },
  { id: 4, eventName: 'Quarterly Riot', date: 'September 8, 2026', status: 'Present' },
  { id: 5, eventName: 'Femboy Assembly', date: 'August 29, 2026', status: 'Absent' },
];
