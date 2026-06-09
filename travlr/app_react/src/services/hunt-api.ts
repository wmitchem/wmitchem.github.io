import { apiClient } from './apiClient';
import type { ShinyHunt } from '../features/pokemon/types/ShinyHunt';

/**
 * Interface defining the payload required to initialize a new shiny hunt.
 */
export interface CreateHuntPayload {
  pokemonId: number;
  pokemonName: string;
  gameGeneration: string;
  huntMethod: string;
  encounters: number;
  hasShinyCharm: boolean;
  startDate: string;
}

/**
 * Sends a POST request to the Express backend to initialize a new shiny hunt in the database.
 *
 * @param huntData - The formatted payload containing the user's hunt configuration.
 * @returns A promise that resolves to the newly created ShinyHunt record data.
 */
export const createShinyHunt = async (
  huntData: CreateHuntPayload,
): Promise<any> => {
  const response = await apiClient.post('/hunts', huntData);
  return response.data;
};

/**
 * Fetches all active (uncaught) shiny hunts for the authenticated user.
 *
 * @returns A promise that resolves to an array of ShinyHunt objects.
 */
export const getAllHunts = async (): Promise<ShinyHunt[]> => {
  const response = await apiClient.get('/hunts');
  return response.data;
};

/**
 * Marks a specific shiny hunt as successfully caught in the database.
 *
 * @param huntId - The unique MongoDB _id string of the hunt to update.
 * @returns A promise that resolves when the update is successful.
 */
export const catchShinyHunt = async (huntId: string): Promise<void> => {
  const response = await apiClient.patch(`/hunts/${huntId}/catch`);
  return response.data;
};

export const updateHuntEncounters = async (
  huntId: string,
  action: 'increment' | 'decrement',
) => {
  const response = await apiClient.patch(`/hunts/${huntId}/encounter`, {
    action: action,
  });

  return response.data;
};
