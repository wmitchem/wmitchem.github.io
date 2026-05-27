import React, { useState, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../features/auth/useAuth';
import FormInput from '../components/ui/FormInput';
import type { RegisterCredentials } from '../types/RegisterCredentials';

/** Internal state mapping for the flat registration form fields. */
interface RegisterFormState {
  name: string;
  email: string;
  passwd: string;
}

/**
 * Page component that displays the new account registration form.
 * Collects user details, formats the payload, and calls the registration API hook.
 *
 * @returns A JSX element containing the centered registration layout.
 */
export default function RegisterPage(): React.JSX.Element {
  const [formData, setFormData] = useState<RegisterFormState>({
    name: '',
    email: '',
    passwd: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const navigate = useNavigate();
  const { mutateAsync: registerUser, isPending, error } = useRegisterMutation();

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
   * Validates the form data, structures it to match the backend DTO, and submits it.
   * Routes the user to the home dashboard upon a successful registration.
   *
   * @param e - The standard web form submission event.
   * @returns An asynchronous Promise tracking the registration transaction.
   */
  const handleFormSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    if (formData.name && formData.email && formData.passwd) {
      // Structuring the flat form data into the decoupled registration interface
      const payload: RegisterCredentials = {
        user: { name: formData.name, email: formData.email },
        passwd: formData.passwd,
      };

      try {
        await registerUser(payload);
        navigate('/');
      } catch (err) {
        console.error(
          'Registration failed. Please try a different email.',
          err,
        );
      }
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Create Account</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            Registration failed. That email may already be in use.
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            submitted={submitted}
            errorMessage="Name is required"
          />

          <div className="mt-3">
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
          </div>

          <div className="mt-3">
            <FormInput
              label="Password"
              name="passwd"
              type="password"
              placeholder="Choose a strong password"
              value={formData.passwd}
              onChange={handleInputChange}
              submitted={submitted}
              errorMessage="Password is required"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-4"
            disabled={isPending}
          >
            {isPending ? 'Creating Profile...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3 pt-3 border-top">
          <small className="text-muted">
            Already have an account? <Link to="/login">Sign in here</Link>.
          </small>
        </div>
      </div>
    </div>
  );
}
