import type { Account } from '../types/event';
import { API_BASE_URL } from './config';

const parseResponse = async (response: Response): Promise<Account> => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'The request failed.');
  }

  return body;
};

export async function signInWithGoogle(idToken: string): Promise<Account> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  return parseResponse(response);
}
