// src/features/auth/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';
import { getCurrentUser, logoutUser } from './authUtils';
import type { User } from '../../types/User';

/**
 * Interface that defines the state and handlers available throughout the authentication context.
 */
interface AuthContextType {
  /** The currently logged-in user profile data, or null if no active session exists. */
  user: User | null;
  /** Clears the saved token from local storage and resets the user state. */
  logout: () => void;
  /** Re-evaluates local storage to update the active user profile state after a login or registration. */
  refreshUserSession: () => void;
}

/**
 * Props interface required by the AuthProvider component wrapper.
 */
interface AuthProviderProps {
  /** The child layout elements that need access to global authentication state. */
  children: ReactNode;
}

// Creating the context base container with an uninitialized default state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Context Provider component that manages the reactive user state across the application tree.
 *
 * @param props - Component properties containing the nested children layouts.
 * @returns A JSX element wrapping the child views with the authentication context provider.
 */
export const AuthProvider = ({
  children,
}: AuthProviderProps): React.JSX.Element => {
  // Lazily initializing the user state from local storage token data on first mount
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  /**
   * Refreshes the user state by checking local storage for a valid token profile.
   *
   * @returns Void.
   */
  const refreshUserSession = (): void => {
    setUser(getCurrentUser());
  };

  /**
   * Removes the session token and updates state to log out the user.
   *
   * @returns Void.
   */
  const logout = (): void => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, refreshUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook providing convenient access to the global authentication state within components.
 *
 * @returns The active context object holding the user profile and session control routines.
 * @throws Error if called outside of a component wrapped in an AuthProvider block.
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'Security Fault: useAuthContext must be executed within an active AuthProvider scope.',
    );
  }
  return context;
};
