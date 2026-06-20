import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import type { Pokemon } from '@capstone/shared';
import { createCollectionQuery } from '../utils/collectionQuery.js';
import { fetchAllPokemon } from '../services/pokemon-api.js';
import { PokemonFilterPanel } from '../features/pokemon/components/PokemonFilterPanel';
import { ExpandableSection } from '../components/ui/ExpandableSection';
import { PaginationControls } from '../components/ui/PaginationControls';
import { PokemonGrid } from '../features/pokemon/components/PokemonGrid';
import { SearchBarWithSuggestions } from '../components/ui/SearchBarWithSuggestions';
import type { PokedexFilterKey } from '../features/pokemon/models/PokedexFilterKey.js';

/**
 * The primary Smart Container for the Global PokéDex page.
 *
 * This component acts as the "brain" of the database view. It is responsible for fetching
 * the master Pokémon index from the backend API, managing the application state exclusively
 * through URL Search Parameters (ensuring the URL is always shareable and clean), and
 * piping the filtered data down to isolated Presentational ("Dumb") child components.
 *
 * @returns The completely assembled database layout.
 */
export default function PokemonDatabase(): React.JSX.Element {
  // --- URL State Management ---
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('search') || '';
  const activeType1 = searchParams.get('type1') || 'All';
  const activeType2 = searchParams.get('type2') || 'All';
  const activeGen = searchParams.get('gen') || 'All';
  const sortField = searchParams.get('sort') || 'dexNumber';
  const sortDirection = (searchParams.get('dir') as 'asc' | 'desc') || 'asc';
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || 25;

  // --- Data Fetching ---
  const {
    data: pokemonIndex,
    isLoading,
    isError,
  } = useQuery<Pokemon[]>({
    queryKey: ['pokemonIndex'],
    queryFn: fetchAllPokemon,
    staleTime: 1000 * 60 * 5,
  });

  /**
   * Helper function that evaluates whether a given filter value represents its
   * "factory default" state. I extracted this logic to keep the state updater clean.
   *
   * @param key - The specific filter parameter being checked.
   * @param value - The current value of that filter.
   * @returns True if the value is the default and should be stripped from the URL.
   *
   * @example
   * // Returns true because 'dexNumber' is the default sort field
   * isDefaultFilterValue('sort', 'dexNumber')
   */
  const isDefaultFilterValue = (
    key: PokedexFilterKey,
    value: string | number,
  ): boolean => {
    if (value === 'All' || value === '') return true;
    if (key === 'page' && value === 1) return true;
    if (key === 'sort' && value === 'dexNumber') return true;
    if (key === 'dir' && value === 'asc') return true;

    return false;
  };

  /**
   * Updates the URL search parameters to reflect user filtering interactions.
   * If a user sets a filter back to its default state, the parameter is deleted
   * entirely to maintain a clean URL.
   *
   * @param key - The typed parameter to update (e.g., 'type1', 'page').
   * @param value - The new value to set.
   *
   * @example
   * // Changes the URL to ?type1=fire and resets the page to 1
   * updateFilter('type1', 'fire')
   */
  const updateFilter = (key: PokedexFilterKey, value: string | number) => {
    setSearchParams((prev) => {
      // Creating a brand new object in memory so React reliably detects the change
      const nextParams = new URLSearchParams(prev);

      if (isDefaultFilterValue(key, value)) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }

      // Always reset to page 1 when changing other filters to prevent blank pages
      if (key !== 'page') nextParams.delete('page');

      return nextParams;
    });
  };

  /**
   * Instantly wipes all active filters, returning the URL to its bare root
   * and resetting the grid to its default un-filtered state.
   */
  const clearAllFilters = () => setSearchParams(new URLSearchParams());

  // --- Memoized Data Derivations ---

  const searchSuggestions = useMemo(() => {
    // Return empty if no data or an empty search bar
    if (!pokemonIndex || searchTerm.trim().length === 0) return [];

    // Execute the fluent query chain
    const results = createCollectionQuery(pokemonIndex)
      .where('name')
      .includes(searchTerm)
      .sortBySearchPriority('name', searchTerm) // Prioritizes prefix matches
      .execute();

    // Return only the top 5 most relevant results for the UI dropdown
    return results.slice(0, 5);
  }, [pokemonIndex, searchTerm]);

  const filteredPokemon = useMemo(() => {
    if (!pokemonIndex) return [];

    // Utilizizing my custom in-memory query engine for O(n) filtering
    const queryEngine = createCollectionQuery(pokemonIndex);

    if (activeType1 !== 'All') queryEngine.where('types').includes(activeType1);
    if (activeType2 !== 'All') queryEngine.where('types').includes(activeType2);
    if (activeGen !== 'All')
      queryEngine.where('generation').equals(Number(activeGen));

    queryEngine.sortBy(sortField, sortDirection);
    let results = queryEngine.execute();

    // Apply manual text search filter after the core parameters
    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(lowercasedTerm),
      );
    }
    return results;
  }, [
    pokemonIndex,
    activeType1,
    activeType2,
    activeGen,
    sortField,
    sortDirection,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const currentDataToRender = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPokemon.slice(startIndex, endIndex);
  }, [filteredPokemon, currentPage, itemsPerPage]);

  const hasActiveFilters =
    activeType1 !== 'All' ||
    activeType2 !== 'All' ||
    activeGen !== 'All' ||
    sortField !== 'dexNumber' ||
    sortDirection !== 'asc';

  return (
    <div className="w-full">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">
        Global PokéDex
      </h1>

      {/* --- Dynamic Search Bar --- */}
      <SearchBarWithSuggestions
        searchTerm={searchTerm}
        onSearchChange={(value) => updateFilter('search', value)}
        suggestions={searchSuggestions}
      />

      {/* --- Progressive Disclosure: Advanced Tools --- */}
      <ExpandableSection
        title="Advanced Tools"
        onClearAll={clearAllFilters}
        activeIndicatorCount={hasActiveFilters ? 1 : 0}
      >
        <PokemonFilterPanel
          activeType1={activeType1}
          activeType2={activeType2}
          activeGen={activeGen}
          sortDirection={sortDirection}
          sortField={sortField}
          onFilterChange={updateFilter}
        />
      </ExpandableSection>

      {/* --- Pagination Controls --- */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => updateFilter('page', page)}
        onLimitChange={(limit) => updateFilter('limit', limit)}
      />

      {/* --- Responsive Tailwind Database Grid --- */}
      <PokemonGrid
        pokemonList={currentDataToRender}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
