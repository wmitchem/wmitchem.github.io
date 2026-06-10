/**
 * Data transfer object for handling user login credentials.
 */
export interface LoginCredentials {
  /** The user's account email address. */
  email: string;
  /** The plain text password entered by the user. */
  passwd: string;
}
