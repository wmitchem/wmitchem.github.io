import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddTrip } from '../features/trips/useTrips';
import TripForm from '../features/trips/components/TripForm';
import type { Trip } from '../types/Trip';

/**
 * Administrative page view handling the addition of new trip entries to the database.
 * Fully refactored to utilize Tailwind CSS with responsive dark mode support.
 *
 * @returns A JSX element containing the creation form layout wrapper.
 */
export default function AddTrip(): React.JSX.Element {
  const navigate = useNavigate();
  // Calling the custom mutation hook for putting data into the API
  const { mutateAsync: addTrip, isPending, error } = useAddTrip();

  /**
   * Fires the creation request payload to the API client and routes back to home on success.
   *
   * @param formData - The validated Trip object fields captured from the child inputs.
   * @returns An asynchronous Promise tracking execution completion.
   */
  const handleFormSubmit = async (formData: Trip): Promise<void> => {
    try {
      await addTrip(formData);
      navigate('/');
    } catch (err) {
      console.error(
        'Error occurred while attempting to create the trip entry:',
        err,
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Add New Trip
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Fill out the fields below to append a brand new vacation itinerary to
          the dashboard database.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div
          className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Failed to create trip. Please ensure the code identifier is
                unique and check backend service connectivity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card Wrapper */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        {/* Rendering the data-driven form component */}
        <TripForm onSubmit={handleFormSubmit} />

        {isPending && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <svg
              className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
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
            <span className="text-sm font-medium">
              Saving travel data to backend services...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
