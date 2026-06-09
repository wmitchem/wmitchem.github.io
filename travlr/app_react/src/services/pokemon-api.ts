import { apiClient } from './apiClient';
import type { AppPokemon } from '../features/pokemon/types/AppPokemon';

export const fetchAllPokemon = async (): Promise<AppPokemon[]> => {
  const response = await apiClient('/pokemon');
  return response.data;
};

/**
 * Fetches a single Pokemon from the Express backend using its National Dex ID.
 *
 * @param id - The unique National Dex ID string of the Pokemon.
 * @returns A promise that resolves to the detailed AppPokemon object.
 */
export const fetchPokemonById = async (id: string): Promise<AppPokemon> => {
  const response = await apiClient.get(`/pokemon/${id}`);
  return response.data;
};
