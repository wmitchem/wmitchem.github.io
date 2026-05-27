import axios from 'axios';

import type { Trip } from '../types/Trip';
import type { User } from '../types/User';
import type { AuthResponse } from '../types/AuthResponse';

const URL = 'http://localhost:3000/api/trips';
const BASE_URL = 'http://localhost:3000/api';

/**
 * Generates request headers required for secure API endpoints.
 * Automatically extracts the cached JWT bearer token from browser localStorage
 * and appends it to the outbound request configuration if an active session exists.
 *
 * @returns An object dictionary containing the configured HTTP headers.
 */
const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('travlr-token');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Core utility handler for managing authentication payload exchanges.
 * Normalizes credentials into a payload shape expected by the backend server
 * before executing the Axios POST transaction.
 *
 * @param endpoint - The target API router slug (such as 'login' or 'register').
 * @param user - The credentials or profile details of the target user.
 * @param passwd - The plaintext password string for transaction verification.
 * @returns A promise that resolves to the API's authentication response containing the session token.
 */
const handleAuthAPICall = async (
  endpoint: string,
  user: User,
  passwd: string,
): Promise<AuthResponse> => {
  const payload = {
    name: user.name,
    email: user.email,
    password: passwd,
  };

  const response = await axios.post<AuthResponse>(
    `${BASE_URL}/${endpoint}`,
    payload,
  );
  return response.data;
};

/**
 * Service managing all outbound API network operations for trip data
 * and user authentication.
 */
const tripApi = {
  /**
   * Fetches the complete collection of trips from the database.
   */
  getTrips: async (): Promise<Trip[]> => {
    const response = await axios.get<Trip[]>(URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Creates a new trip entry in the database.
   *
   * @param formData - The data payload for the trip.
   */
  addTrip: async (formData: Trip): Promise<Trip> => {
    const response = await axios.put<Trip>(URL, formData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Retrieves a single trip filtered by its unique trip code.
   *
   * @param tripCode - The unique identifier string for the trip.
   */
  getTrip: async (tripCode: string): Promise<Trip[]> => {
    const response = await axios.get<Trip[]>(`${URL}/${tripCode}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Updates an existing trip entry using its unique code identifier.
   *
   * @param formData - The modified trip details.
   */
  updateTrip: async (formData: Trip): Promise<Trip> => {
    const response = await axios.post<Trip>(
      `${URL}/${formData.code}`,
      formData,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  },

  /**
   * Submits user credentials to the login endpoint.
   *
   * @param user - The login credentials.
   * @param passwd - The plaintext password.
   */
  login: async (user: User, passwd: string): Promise<AuthResponse> => {
    return handleAuthAPICall('login', user, passwd);
  },

  /**
   * Submits registration details to create a new user profile.
   *
   * @param user - The profile registration details.
   * @param passwd - The chosen secure password.
   */
  register: async (user: User, passwd: string): Promise<AuthResponse> => {
    return handleAuthAPICall('register', user, passwd);
  },
};

export default tripApi;
