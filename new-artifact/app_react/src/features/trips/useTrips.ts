import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
  type QueryKey,
} from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import type { Trip } from '../../types/Trip';

/**
 * Interface that defines the required array structures for the Trip query keys.
 * This locks down the cache keys to prevent runtime typo errors.
 */
interface TripKeyRegistry {
  /** Base key used for the entire trips collection cache. */
  readonly all: readonly ['trips'];

  /**
   * Generates a unique cache key for a specific trip view.
   *
   * @param code - The unique alphanumeric identifier string for the trip.
   * @returns An immutable array containing th ebase key and the trip code.
   */
  readonly detail: (code: string) => readonly ['trips', string];
}

/**
 * Global source of truth dictionary for the trips cache keys.
 */
export const tripKeys: TripKeyRegistry = {
  all: ['trips'] as const,
  detail: (code: string) => ['trips', code] as const,
};

// ============================================================================
// DATA TRANSFORMATION HELPERS
// ============================================================================

/**
 * Intercepts the raw API payload and formats backend-specific types
 * (like ISO Date strings) into frontend-friendly formats.
 *
 * @param trip - The raw trip object returned from the backend API.
 * @returns A formatted Trip object safe for HTML5 input binding.
 */
const formatTripData = (trip: Trip): Trip => {
  return {
    ...trip,
    // Safely extract just the 'YYYY-MM-DD' portion of the ISO timestamp
    start: trip.start ? trip.start.substring(0, 10) : '',
  };
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Custom hook that fetches the complete array of trips from the API endpoint.
 *
 * @returns A TanStack Query result wrapper containing the fetched trips data, loading, and error states.
 */
export const useTrips = (): UseQueryResult<Trip[], Error> => {
  const queryKey: QueryKey = tripKeys.all;

  return useQuery<Trip[], Error>({
    queryKey,
    queryFn: async (): Promise<Trip[]> => {
      const { data } = await apiClient.get<Trip[]>('/trips');
      return data.map(formatTripData);
    },
  });
};

/**
 * Custom hook that fetches a single trip payload from the backend filtered by its unique code.
 *
 * @param tripCode - The unique string key representing the specific trip.
 * @returns A TanStack Query result wrapper holding the trip detail data, loading, and error states.
 */
export const useTripDetail = (
  tripCode: string,
): UseQueryResult<Trip[], Error> => {
  const queryKey: QueryKey = tripKeys.detail(tripCode);

  return useQuery<Trip[], Error>({
    queryKey,
    queryFn: async (): Promise<Trip[]> => {
      const { data } = await apiClient.get<Trip[]>(`/trips/${tripCode}`);
      return data.map(formatTripData);
    },
    enabled: !!tripCode,
  });
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Custom hook for sending a new trip entry payload to the backend server.
 * On success, it clears out the stale root trips cache so the UI automatically re-fetches.
 *
 * @returns A TanStack Mutation interface containing data handlers and async processing states.
 */
export const useAddTrip = (): UseMutationResult<Trip, Error, Trip> => {
  const queryClient = useQueryClient();

  return useMutation<Trip, Error, Trip>({
    mutationFn: async (formData: Trip): Promise<Trip> => {
      const { data } = await apiClient.post<Trip>('/trips', formData);
      return data;
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
};

/**
 * Custom hook for updating an existing trip entry payload on the backend server.
 * Triggers a dual cache invalidation on success to update both the listing and specific detail view.
 *
 * @returns A TanStack Mutation interface containing data handlers and async processing states.
 */
export const useUpdateTrip = (): UseMutationResult<Trip, Error, Trip> => {
  const queryClient = useQueryClient();

  return useMutation<Trip, Error, Trip>({
    mutationFn: async (formData: Trip): Promise<Trip> => {
      const { data } = await apiClient.put<Trip>(
        `/trips/${formData.code}`,
        formData,
      );
      return data;
    },
    onSuccess: async (_data: Trip, variables: Trip): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: tripKeys.all });
      await queryClient.invalidateQueries({
        queryKey: tripKeys.detail(variables.code),
      });
    },
  });
};
