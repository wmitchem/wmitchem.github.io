import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripDetail, useUpdateTrip } from '../features/trips/useTrips';
import TripForm from '../features/trips/components/TripForm';
import type { Trip } from '../types/Trip';

/**
 * Administrative page view that grabs route parameters to query and update specific trip records.
 *
 * @returns A JSX layout displaying loading states, errors, or a pre-populated form container.
 */
export default function EditTrip(): React.JSX.Element {
  // Extract the code variable token directly from the URL address bar state
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  // Query and update data hooks from TanStack Query
  const { data: tripData, isPending, error } = useTripDetail(code || '');
  const { mutateAsync: updateTrip } = useUpdateTrip();

  // Access the first object in the return array payload if data exists
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

  if (isPending)
    return (
      <div className="container py-5 text-center">Loading trip data...</div>
    );
  if (error || !targetTrip)
    return (
      <div className="container py-5 text-center alert alert-danger">
        Error: Trip not found.
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Edit Trip: {targetTrip.name}</h2>
      {/* Passing the fetched database record down to pre-populate form state */}
      <TripForm onSubmit={handleFormSave} initialData={targetTrip} />
    </div>
  );
}
