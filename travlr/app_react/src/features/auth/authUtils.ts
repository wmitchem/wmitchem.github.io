import type { User } from '@capstone/shared';

/** Key identifier used to store the token in localStorage. */
const TOKEN_KEY = 'travlr-token' as const;

/**
 * Reads the saved JWT token from browser local storage.
 *
 * @returns The active JWT token string, or an empty string if unauthenticated.
 */
export const getToken = (): string => {
  const token: string | null = localStorage.getItem(TOKEN_KEY);
  return token !== null ? token : '';
};

/**
 * Saves a new JWT token to browser local storage.
 *
 * @param token - The secure authentication token returned by the API.
 * @returns Void.
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Clears the active authentication session from browser local storage.
 *
 * @returns Void.
 */
export const logoutUser = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Evaluates if a user session is active and cryptographically valid.
 * Extracts the expiration payload from the JWT and compares it against the local epoch time.
 *
 * @returns True if a valid token exists and its expiration time is in the future.
 */
export const isLoggedIn = (): boolean => {
  const token: string = getToken();
  if (!token) {
    return false;
  }

  try {
    const payloadSegment: string = token.split('.')[1];
    if (!payloadSegment) {
      return false;
    }

    // Decoding the payload part of the base64 JWT string.
    const payload = JSON.parse(atob(payloadSegment)) as { exp: number };

    // Verify token expiration against local system time (converted to seconds).
    return payload.exp > Date.now() / 1000;
  } catch (error: unknown) {
    console.error(
      'Security Warning: Malformed authentication token encountered during validation checks.',
      error,
    );
    return false;
  }
};

/**
 * Decodes the current user profile fields stored inside the session token.
 *
 * @returns The User object if authenticated, or null if the token is invalid or expired.
 */
export const getCurrentUser = (): User | null => {
  const token: string = getToken();
  if (!token || !isLoggedIn()) {
    return null;
  }

  try {
    const payloadSegment: string = token.split('.')[1];
    const { email, name } = JSON.parse(atob(payloadSegment)) as {
      email: string;
      name: string;
    };
    return { email, name };
  } catch (error: unknown) {
    console.error(
      'Security Warning: Extraction of profile info from token failed due to parsing anomalies.',
      error,
    );
    return null;
  }
};
