import type { User } from './User';

/**
 * Data transfer object for handling new user registration data.
 */
export interface RegisterCredentials {
  /** The core profile details matching the standard User model. */
  user: User;
  /** The plain text password entered by the user. */
  passwd: string;
}
