import React from 'react';
import { useTrips } from '../features/trips/useTrips';
import TripCard from '../features/trips/components/TripCard';
import type { Trip } from '@capstone/shared';

/**
 * Page component that queries the trip index database collection and lists the results.
 * Fully refactored to utilize Tailwind CSS layouts and dark mode (from enhancement one).
 *
 * @returns A JSX element displaying a loading grid, error statement, or mapped card layout.
 */
export default function TripListing(): React.JSX.Element {
  // Leveraging TanStack Query cache management hooks
  const { data: trips, isPending, error } = useTrips();

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
          Loading available travel itineraries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-10 mt-10">
        <div
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-6 py-4 rounded-xl shadow-sm text-center"
          role="alert"
        >
          <p className="font-bold text-lg mb-1">Database Connection Error</p>
          <p className="text-sm">
            Failed to retrieve data from the backend trip API. Please ensure
            your Express server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* --- Page Header --- */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300 mb-2">
            Trip Itineraries
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Explore our active travel offerings and vacation destinations.
          </p>
        </div>
      </div>

      {/* --- Trip Display Grid --- */}
      {trips && trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 mt-10">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium text-center">
            No active travel records found in the database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips?.map((individualTrip: Trip) => (
            <div className="h-full" key={individualTrip._id}>
              <TripCard trip={individualTrip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
