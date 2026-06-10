import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTripDetail, useUpdateTrip } from '../features/trips/useTrips';
import TripForm from '../features/trips/components/TripForm';
import type { Trip } from '@capstone/shared';

/**
 * Administrative page view that grabs route parameters to query and update specific trip records.
 *
 * @returns A JSX layout displaying loading states, errors, or a pre-populated form container.
 */
export default function EditTrip(): React.JSX.Element {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data: tripData, isPending, error } = useTripDetail(code || '');
  const { mutateAsync: updateTrip } = useUpdateTrip();

  const targetTrip: Trip | undefined = tripData?.[0];

  /**
   * Handles saving form modifications and returns the user to the homepage dashboard.
   *
   * @param updatedFields - The validated Trip model fields captured from the form.
   * @returns An asynchronous Promise tracking execution completion.
   */
  const handleFormSave = async (updatedFields: Trip): Promise<void> => {
    try {
      await updateTrip(updatedFields);
      navigate('/');
    } catch (err) {
      console.error('Failed to commit database modifications:', err);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
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
        <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Loading trip data...
        </p>
      </div>
    );
  }

  if (error || !targetTrip) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-10 mt-10">
        <div
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-6 py-4 rounded-xl shadow-sm text-center"
          role="alert"
        >
          <p className="font-bold text-lg mb-1">Trip Not Found</p>
          <p className="text-sm">
            Error: Unable to locate the specified trip record.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Edit Trip: {targetTrip.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Modify the itinerary details below. Changes will be synced to the
          database.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <TripForm onSubmit={handleFormSave} initialData={targetTrip} />
      </div>
    </div>
  );
}
