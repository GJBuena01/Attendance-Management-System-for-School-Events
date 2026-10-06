import type {
  AttendanceRecord,
  CreateEventInput,
  EventRecord,
  StudentAttendanceRecord,
} from '../types/event';

export const API_BASE_URL = 'http://10.12.26.140:3000';

const parseResponse = async (response: Response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'The request failed.');
  }

  return body;
};

export async function getEvents(): Promise<EventRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  return parseResponse(response);
}

export async function createEvent(event: CreateEventInput): Promise<EventRecord> {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  return parseResponse(response);
}

export async function getEventAttendance(eventId: number): Promise<AttendanceRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/attendance`);
  const body = await parseResponse(response);
  return body.attendance;
}

export async function recordAttendance(input: {
  studentId: string;
  eventId: number;
  scannedBy: string;
}): Promise<AttendanceRecord> {
  const response = await fetch(`${API_BASE_URL}/api/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseResponse(response);
}

export async function getStudentAttendance(
  studentId: string,
): Promise<StudentAttendanceRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/attendance`);
  const body = await parseResponse(response);
  return body.attendance;
}
