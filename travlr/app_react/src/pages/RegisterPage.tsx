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
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md transition-colors duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6 transition-colors duration-300">
          Create Account
        </h2>

        {error && (
          <div
            className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg shadow-sm flex items-center"
            role="alert"
          >
            <svg
              className="h-5 w-5 mr-3 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Registration failed. That email may already be in use.
            </span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
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

          <button
            type="submit"
            className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Profile...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 text-center transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Sign in here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
