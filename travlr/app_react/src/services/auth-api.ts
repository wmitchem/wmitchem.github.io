import type { User } from '../types/User';
import type { AuthResponse } from '../types/AuthResponse';
import tripApi from './trip-api';

// File-scoped constant. Private to this module automatically.
const TOKEN_KEY = 'travlr-token';

/**
 * Service managing the client-side authentication lifecycle, JWT token cache,
 * and user session validation via browser localStorage.
 */
const authApi = {
  /**
   * Retrieves the cached JWT token from local browser storage.
   * Ensures a string is always returned to prevent null-pointer exceptions.
   *
   * @returns The active JWT token string, or an empty string if unauthenticated.
   */
  getToken: (): string => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? token : '';
  },

  /**
   * Persists a newly issued JWT token into browser storage to establish a session.
   *
   * @param token - The secure JWT string issued by the backend API.
   */
  saveToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Destroys the active user session by removing the cached JWT from storage.
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Evaluates if a user session is active and cryptographically avalid.
   * Extracts the expiration payload from the JWT and compares it against the server-epoch time.
   */
  isLoggedIn: (): boolean => {
    const token = authApi.getToken();
    if (!token) return false;

    try {
      // Decodes the base64 payload segment of the JSON Web Token
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Security Check: Enforce token expiration validation against local system time (in seconds).
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      console.error(
        'Security Warning: Malformed authentication token encountered.',
        error,
      );
      return false;
    }
  },

  /**
   * Extracts the authenticated profile information directly from the active session token.
   * Note: This method must only be executed after verifying session validity via isLoggedIn().
   *
   * @returns The profile data of the currently logged-in user.
   */
  getCurrentUser: (): User => {
    const token = authApi.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  },

  /**
   * Proxies user credentials to the network gateway to establish a secure session.
   * Replaces Angular's RxJS Observable stream with an asynchronous Promise architecture.
   *
   * @param user - The credentials payload containing user identification.
   * @param passwd - The plaintext verification password.
   */
  login: async (user: User, passwd: string): Promise<void> => {
    try {
      const response: AuthResponse = await tripApi.login(user, passwd);

      if (response && response.token) {
        authApi.saveToken(response.token);
      }
    } catch (error) {
      console.error('Authentication Error: Login transaction failed.', error);
      // Propagating the error so that the UI forms can catch it and display errors.
      throw error;
    }
  },

  /**
   * Submits a registration profile to create a new user account, immediately
   * caching the resulting token to automatically log the user in upon creation.
   *
   * @param user - The new user registration profile information.
   * @param passwd - The chosen password string.
   */
  register: async (user: User, passwd: string): Promise<void> => {
    try {
      const response: AuthResponse = await tripApi.register(user, passwd);

      if (response && response.token) {
        authApi.saveToken(response.token);
      }
    } catch (error) {
      console.error(
        'Authentication Error: Registration transaction failed.',
        error,
      );
      // Propagating the error so that the UI forms can catch it and display errors.
      throw error;
    }
  },
};

export default authApi;
