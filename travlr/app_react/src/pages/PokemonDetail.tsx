import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonById } from '../services/pokemon-api';
import type { AppPokemon } from '../features/pokemon/types/AppPokemon';
import { getPokemonImageURL } from '../features/pokemon/utils/spriteFetcher';

/**
 * A detailed page view that fetches and displays comprehensive data for a single Pokemon.
 * Includes nested stat mappings, physical characteristics, abilities, and a call-to-action
 * button to initiate a new shiny hunt.
 *
 * @returns React element rendering the detailed profile or a loading state.
 */
export default function PokemonDetail(): React.JSX.Element {
  /**
   * Helper function to dynamically generate the local image path.
   * Assumes the images are named exactly as the types (e.g., 'fire.png', 'water.png')
   * and are located in public/assets/images/types/
   */
  const getTypeIconPath = (typeName: string): string => {
    // Converting to lowercase to ensure it matches the file names safely
    return `/assets/images/types/${typeName.toLowerCase()}.png`;
  };

  const { id } = useParams<{ id: string }>();

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery<AppPokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Loading Pokedex Data...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fetching biological data from the server...
        </p>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Error loading Pokemon details.
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please ensure the Express API is running and reachable.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* --- Visual Profile & Physical Traits --- */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-900/50 p-6 rounded-lg w-full md:w-1/3 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <img
              src={getPokemonImageURL(pokemon.id)}
              alt={pokemon.name}
              className="w-48 h-48 object-contain drop-shadow-md"
            />
            <h1 className="text-3xl font-extrabold mt-4 text-gray-900 dark:text-white capitalize transition-colors duration-300">
              {pokemon.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              National Dex #{String(pokemon.id).padStart(3, '0')}
            </p>

            <div className="flex gap-2 mt-4 mb-6">
              {/* Rendering Type Icons dynamically */}
              {pokemon.types && (
                <div className="flex flex-col justify-center items-center gap-2 mt-3">
                  {pokemon.types.map((type) => (
                    <img
                      key={type}
                      src={getTypeIconPath(type)}
                      alt={`${type} Type`}
                      className="h-8 w-auto object-contain drop-shadow-sm transition-transform hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Height and Weight Data */}
            <div className="grid grid-cols-2 gap-4 w-full text-center border-t border-gray-200 dark:border-slate-700 pt-6 transition-colors duration-300">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Height
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {pokemon.height} m
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Weight
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {pokemon.weight} kg
                </p>
              </div>
            </div>
          </div>

          {/* --- Detailed Stats, Abilities & Action --- */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            {/* Base Stats Section */}
            <div>
              <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-slate-700 pb-3 mb-5 text-gray-900 dark:text-white transition-colors duration-300">
                Base Stats
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-900/50 p-5 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    HP
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.hp}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    Attack
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.attack}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    Defense
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.defense}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    Sp. Atk
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.specialAttack}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    Sp. Def
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.specialDefense}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                    Speed
                  </span>
                  <span className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
                    {pokemon.stats.speed}
                  </span>
                </div>
              </div>
            </div>

            {/* Abilities Section */}
            <div>
              <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-slate-700 pb-3 mb-5 text-gray-900 dark:text-white transition-colors duration-300">
                Abilities
              </h2>
              <ul className="space-y-4">
                {pokemon.abilities.map((ability, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors duration-300"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <p className="font-bold text-lg text-gray-900 dark:text-white m-0">
                        {ability.name}
                      </p>
                      {ability.isHidden && (
                        <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/50 px-2.5 py-1 rounded-full uppercase tracking-wide font-bold">
                          Hidden Ability
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed m-0">
                      {ability.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div className="mt-auto pt-6">
              <Link
                to={`/hunts/new/${pokemon.id}`}
                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                Start Shiny Hunt for {pokemon.name}!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
