import type { Account } from '../types/event';
import { API_BASE_URL } from './events';

const parseResponse = async (response: Response): Promise<Account> => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'The request failed.');
  }

  return body;
};

export async function signupStudent(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<Account> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseResponse(response);
}

export async function loginStudent(input: {
  email: string;
  password: string;
}): Promise<Account> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseResponse(response);
}