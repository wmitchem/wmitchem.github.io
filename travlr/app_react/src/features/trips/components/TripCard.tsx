import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../auth/AuthContext';
import type { Trip } from '../../../types/Trip';

interface TripCardProps {
  trip: Trip;
}

/**
 * Component displaying individual trip item profiles with declarative edit route parameters.
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
   * ```typescript
   * const price = formatCurrency(1499);
   * // returns "$1,499.00"
   * ```
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
    <div className="card">
      <div className="card-header">{trip.name}</div>
      <img
        src={`/assets/images/${trip.image}`}
        className="card-img-top"
        alt="trip thumbnail"
      />
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{trip.resort}</h6>
        <p className="card-subtitle mt-3 mb-3 text-muted">
          {trip.length} only {formatCurrency(trip.perPerson)} per person
        </p>
        <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
          {trip.description}
        </p>

        {user && (
          <div>
            {/* Declarative link navigation that injects the code directly into the URL path string */}
            <Link to={`/edit-trip/${trip.code}`} className="btn btn-info">
              Edit Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
