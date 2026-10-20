import type {
  AttendanceRecord,
  CreateEventInput,
  EventRecord,
  StudentAttendanceRecord,
} from '../types/event';
import { API_BASE_URL } from './config';

export { API_BASE_URL } from './config';

const parseResponse = async (response: Response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'The request failed.');
  }

  return body;
};

export async function getEvents(options?: { archived?: boolean }): Promise<EventRecord[]> {
  const query = options?.archived ? '?archived=true' : '';
  const response = await fetch(`${API_BASE_URL}/api/events${query}`);
  return parseResponse(response);
}

export async function archiveEvent(eventId: number, archivedBy: string): Promise<EventRecord> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/archive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ archivedBy }),
  });

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
