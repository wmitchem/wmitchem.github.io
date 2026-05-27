import React, { useState, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/useAuth';
import FormInput from '../components/ui/FormInput';
import type { LoginCredentials } from '../types/LoginCredentials';

/**
 * Page component that displays the user login form.
 * Manages credential input state and passes it to the authentication mutation.
 *
 * @returns A JSX element containing the centered login form layout.
 */
export default function LoginPage(): React.JSX.Element {
  // Initialize form state to match the required authentication payload
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    passwd: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const navigate = useNavigate();
  const { mutateAsync: loginUser, isPending, error } = useLoginMutation();

  /**
   * Updates the local form state when an input field changes.
   *
   * @param e - The standard change event from the input element.
   * @returns Void.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Validates the form data and attempts to log the user in via the API.
   * Routes the user to the home dashboard upon a successful response.
   *
   * @param e - The standard web form submission event.
   * @returns An asynchronous Promise tracking the login transaction.
   */
  const handleFormSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    // Basic client-side check to ensure both fields contain text
    if (formData.email && formData.passwd) {
      try {
        await loginUser(formData);
        navigate('/');
      } catch (err) {
        console.error('Login failed. Please check your credentials.', err);
      }
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign In</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            Invalid email or password. Please try again.
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleInputChange}
            submitted={submitted}
            errorMessage="Email is required"
          />

          <div className="mt-3">
            <FormInput
              label="Password"
              name="passwd"
              type="password"
              placeholder="Enter your password"
              value={formData.passwd}
              onChange={handleInputChange}
              submitted={submitted}
              errorMessage="Password is required"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={isPending}
          >
            {isPending ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-3 pt-3 border-top">
          <small className="text-muted">
            Don't have an account? <Link to="/register">Register here</Link>.
          </small>
        </div>
      </div>
    </div>
  );
}
