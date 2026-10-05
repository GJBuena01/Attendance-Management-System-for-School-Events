import type { CreateEventInput, EventRecord } from '../types/event';

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
