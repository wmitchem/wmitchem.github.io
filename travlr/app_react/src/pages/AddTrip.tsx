import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddTrip } from '../features/trips/useTrips';
import TripForm from '../features/trips/components/TripForm';
import type { Trip } from '../types/Trip';

/**
 * Administrative page view handling the addition of new trip entries to the database.
 *
 * @returns A JSX element containing the creation form layout wrapper.
 */
export default function AddTrip(): React.JSX.Element {
  const navigate = useNavigate();
  // Call the custom mutation hook for putting data into the API
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
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="h2 text-dark mb-1">Add New Trip</h1>
        <p className="text-muted">
          Fill out the fields below to append a brand new vacation itinerary to
          the dashboard database.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          Failed to create trip. Please ensure the code identifier is unique and
          check backend service connectivity.
        </div>
      )}

      <div className="card shadow-sm p-4 bg-white rounded">
        {/* Render the data-driven form component */}
        <TripForm onSubmit={handleFormSubmit} />

        {isPending && (
          <div className="text-muted mt-3">
            Saving travel data to backend services...
          </div>
        )}
      </div>
    </div>
  );
}
