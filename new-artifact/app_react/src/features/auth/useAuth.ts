import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { saveToken } from './authUtils';
import { useAuthContext } from './AuthContext';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@capstone/shared';

/**
 * Custom mutation hook for managing user login requests.
 * Saves the token to local storage and refreshes the global session state on a successful response.
 *
 * * @returns A TanStack Mutation wrapper containing trigger handlers and request status flags.
 */
export const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  Error,
  LoginCredentials
> => {
  const { refreshUserSession } = useAuthContext();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async ({
      email,
      passwd,
    }: LoginCredentials): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/login', {
        name: '', // Kept for backend compatibility matches
        email,
        password: passwd,
      });
      return data;
    },
    onSuccess: (data: AuthResponse): void => {
      if (data && data.token) {
        saveToken(data.token);
        refreshUserSession(); // Synchronizes the authentication context state
      }
    },
  });
};

/**
 * Custom mutation hook for managing new user registration requests.
 * Automatically initializes a user session on a successful account creation.
 *
 * * @returns A TanStack Mutation wrapper containing trigger handlers and request status flags.
 */
export const useRegisterMutation = (): UseMutationResult<
  AuthResponse,
  Error,
  RegisterCredentials
> => {
  const { refreshUserSession } = useAuthContext();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: async ({
      user,
      passwd,
    }: RegisterCredentials): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/register', {
        name: user.name,
        email: user.email,
        password: passwd,
      });
      return data;
    },
    onSuccess: (data: AuthResponse): void => {
      if (data && data.token) {
        saveToken(data.token);
        refreshUserSession(); // Synchronizes the authentication context state
      }
    },
  });
};
