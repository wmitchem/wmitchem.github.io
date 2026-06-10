import React from 'react';
import { Link } from 'react-router';
import { useAuthContext } from '../../auth/AuthContext';
import type { Trip } from '@capstone/shared';

interface TripCardProps {
  trip: Trip;
}

/**
 * Component displaying individual trip item profiles with declarative edit route parameters.
 * Fully refactored to utilize Tailwind CSS with dark mode integration and Flexbox heights.
 *
 * @param props - Component configuration holding the individual trip data model.
 * @returns A JSX element containing a structured layout information card.
 */
export default function TripCard({ trip }: TripCardProps): React.JSX.Element {
  const { user } = useAuthContext();

  /**
   * Formats a numeric value into a localized US Dollar currency string.
   *
   * This utility leverages the native `Intl.NumberFormat` API to ensure
   * consistent, locale-aware currency presentation. It handles both numeric
   * types and string representations by casting input to a float before formatting.
   *
   * @param value - The numeric value or string representation of the price.
   * @returns A formatted currency string (e.g., "$1,499.00").
   * @example
   * const price = formatCurrency(1499);
   * // returns "$1,499.00"
   *
   */
  const formatCurrency = (value: number | string) => {
    // Ensure the value is cast to a number before formatting
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* --- Card Header --- */}
      <div className="px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0 truncate">
          {trip.name}
        </h3>
      </div>

      {/* --- Responsive Image Wrapper --- */}
      <img
        src={`/assets/images/${trip.image}`}
        className="w-full h-48 object-cover"
        alt={`${trip.name} thumbnail`}
      />

      {/* --- Card Body --- */}
      <div className="flex flex-col flex-grow p-5 transition-colors duration-300">
        <h6 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {trip.resort}
        </h6>

        <p className="text-sm font-semibold text-blue-600 dark:text-indigo-400 mb-4">
          {trip.length} — Only {formatCurrency(trip.perPerson)} per person
        </p>

        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-6 flex-grow">
          {trip.description}
        </p>

        {/* --- Admin Controls --- */}
        {user && (
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
            <Link
              to={`/edit-trip/${trip.code}`}
              className="block w-full text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 font-medium rounded-lg transition-colors duration-200"
            >
              Edit Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
