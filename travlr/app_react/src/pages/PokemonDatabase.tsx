import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import type { AppPokemon } from '../features/pokemon/types/AppPokemon';
import { PokemonCard } from '../features/pokemon/components/PokemonCard';
import { createCollectionQuery } from '../utils/collectionQuery';
import { fetchAllPokemon } from '../services/pokemon-api';
import { getPokemonImageURL } from '../features/pokemon/utils/spriteFetcher';

const POKEMON_TYPES = [
  'Bug',
  'Dark',
  'Dragon',
  'Electric',
  'Fairy',
  'Fighting',
  'Fire',
  'Flying',
  'Ghost',
  'Grass',
  'Ground',
  'Ice',
  'Normal',
  'Poison',
  'Psychic',
  'Rock',
  'Steel',
  'Water',
];

const GAME_GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1);

const SORT_OPTIONS = [
  { label: 'Pokédex Number', value: 'id' },
  { label: 'Weight', value: 'weight' },
  { label: 'Height', value: 'height' },
  { label: 'HP', value: 'stats.hp' },
  { label: 'Attack', value: 'stats.attack' },
  { label: 'Defense', value: 'stats.defense' },
  { label: 'Special Attack', value: 'stats.specialAttack' },
  { label: 'Special Defense', value: 'stats.specialDefense' },
  { label: 'Speed', value: 'stats.speed' },
];

export default function PokemonDatabase(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('search') || '';
  const activeType1 = searchParams.get('type1') || 'All';
  const activeType2 = searchParams.get('type2') || 'All';
  const activeGen = searchParams.get('gen') || 'All';
  const sortField = searchParams.get('sort') || 'id';
  const sortDirection = (searchParams.get('dir') as 'asc' | 'desc') || 'asc';
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || 25;

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  const {
    data: pokemonIndex,
    isLoading,
    isError,
  } = useQuery<AppPokemon[]>({
    queryKey: ['pokemonIndex'],
    queryFn: fetchAllPokemon,
    staleTime: 1000 * 60 * 5,
  });

  const updateFilter = (key: string, value: string | number) => {
    setSearchParams((prev) => {
      if (value === 'All' || value === '' || (key === 'page' && value === 1)) {
        prev.delete(key);
      } else {
        prev.set(key, String(value));
      }
      if (key !== 'page') prev.delete('page');
      return prev;
    });
  };

  const clearAllFilters = () => setSearchParams(new URLSearchParams());

  const searchSuggestions = useMemo(() => {
    // Guard clause: Return empty if no data or empty search
    if (!pokemonIndex || searchTerm.trim().length === 0) return [];

    // Execute the fluent query chain
    const results = createCollectionQuery(pokemonIndex)
      .where('name')
      .includes(searchTerm)
      .sortBySearchPriority('name', searchTerm) // Prioritizes prefix matches
      .execute();

    // Return only the top 5 most relevant results
    return results.slice(0, 5);
  }, [pokemonIndex, searchTerm]);

  const filteredPokemon = useMemo(() => {
    if (!pokemonIndex) return [];
    const queryEngine = createCollectionQuery(pokemonIndex);

    if (activeType1 !== 'All') queryEngine.where('types').includes(activeType1);
    if (activeType2 !== 'All') queryEngine.where('types').includes(activeType2);
    if (activeGen !== 'All')
      queryEngine.where('generation').equals(Number(activeGen));

    queryEngine.sortBy(sortField, sortDirection);
    let results = queryEngine.execute();

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
    sortField !== 'id' ||
    sortDirection !== 'asc';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Loading PokéDex...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fetching Pokémon details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Error loading database.
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please ensure the Express API is running and reachable.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">
        Global PokéDex
      </h1>

      {/* --- Dynamic Search Bar --- */}
      <div className="relative mb-8 z-30 max-w-3xl mx-auto">
        <div className="flex relative shadow-sm rounded-lg">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 text-lg border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={(e) => updateFilter('search', e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors"
              type="button"
              onClick={() => updateFilter('search', '')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {isSearchFocused && searchSuggestions.length > 0 && (
          <ul className="absolute w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-40">
            {searchSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
                onMouseDown={() => updateFilter('search', suggestion.name)}
              >
                <img
                  src={getPokemonImageURL(suggestion.id)}
                  alt={suggestion.name}
                  className="w-10 h-10 object-contain"
                />
                <span className="font-bold text-gray-900 dark:text-white">
                  {suggestion.name}
                </span>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  Dex #{suggestion.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Progressive Disclosure: Advanced Tools --- */}
      <div className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-4 md:p-6 mb-8 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h5 className="text-lg font-bold text-gray-700 dark:text-gray-200 m-0">
              Advanced Tools
            </h5>
            {!isFiltersExpanded && hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                Active Filters
              </span>
            )}
            {hasActiveFilters && (
              <button
                className="text-xs font-medium text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded transition-colors"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            {isFiltersExpanded ? 'Hide Tools ▲' : 'Show Sort & Filter ▼'}
          </button>
        </div>

        {isFiltersExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="type1Filter"
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Primary Type
                </label>
                <select
                  id="type1Filter"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  value={activeType1}
                  onChange={(e) => updateFilter('type1', e.target.value)}
                >
                  <option value="All">Any Type</option>
                  {POKEMON_TYPES.map((type) => (
                    <option key={`t1-${type}`} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="type2Filter"
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Secondary Type
                </label>
                <select
                  id="type2Filter"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  value={activeType2}
                  onChange={(e) => updateFilter('type2', e.target.value)}
                >
                  <option value="All">Any Type</option>
                  {POKEMON_TYPES.map((type) => (
                    <option key={`t2-${type}`} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="genFilter"
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Generation
                </label>
                <select
                  id="genFilter"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  value={activeGen}
                  onChange={(e) => updateFilter('gen', e.target.value)}
                >
                  <option value="All">All Generations</option>
                  {GAME_GENERATIONS.map((gen) => (
                    <option key={gen} value={gen}>
                      Generation {gen}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="sortField"
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap w-20"
                >
                  Sort By:
                </label>
                <select
                  id="sortField"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  value={sortField}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="sortDirection"
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap w-20"
                >
                  Order:
                </label>
                <select
                  id="sortDirection"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  value={sortDirection}
                  onChange={(e) => updateFilter('dir', e.target.value)}
                >
                  <option value="asc">Ascending (Low to High)</option>
                  <option value="desc">Descending (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center gap-3">
          <label
            htmlFor="itemsPerPage"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Results per page:
          </label>
          <select
            id="itemsPerPage"
            className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
            value={itemsPerPage}
            onChange={(e) => updateFilter('limit', e.target.value)}
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => updateFilter('page', Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>

          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() =>
              updateFilter('page', Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next &raquo;
          </button>
        </div>
      </div>

      {/* --- Responsive Tailwind Database Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentDataToRender.length > 0 ? (
          currentDataToRender.map((pokemon) => (
            <div key={pokemon.id} className="w-full max-w-sm mx-auto">
              <PokemonCard pokemon={pokemon} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 transition-colors">
            <h4 className="text-lg text-gray-500 dark:text-gray-400 font-medium text-center">
              No Pokémon found matching your search and filter criteria.
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}
