import React from 'react';
import { useTrips } from '../features/trips/useTrips';
import TripCard from '../features/trips/components/TripCard';
import type { Trip } from '../types/Trip';

/**
 * Page component that queries the trip index database collection and lists the results.
 *
 * @returns A JSX element displaying a loading grid, error statement, or mapped card layout.
 */
export default function TripListing(): React.JSX.Element {
  // Leveraging TanStack Query cache management hooks
  const { data: trips, isPending, error } = useTrips();

  if (isPending) {
    return (
      <div className="container py-5 text-center">
        <p className="fs-4 text-muted">
          Loading available travel itineraries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          Error: Failed to retrieve data from the backend trip API.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 text-dark fw-bold mb-1">Trip Itineraries</h1>
          <p className="text-muted mb-0">
            Explore our active travel offerings and vacation destinations.
          </p>
        </div>
      </div>

      {/* Trip Display */}
      {trips && trips.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-5 text-secondary">
            No active travel records found in the database.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {trips?.map((individualTrip: Trip) => (
            <div className="col" key={individualTrip._id}>
              <TripCard trip={individualTrip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
