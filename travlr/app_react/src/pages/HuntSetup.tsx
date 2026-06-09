import React, { useTransition } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonById } from '../services/pokemon-api';
import { createShinyHunt } from '../services/hunt-api';
import { getPokemonImageURL } from '../features/pokemon/utils/spriteFetcher';

/**
 * A React 19 form page allowing the user to configure and initialize a new shiny hunt.
 * Leverages native form actions and transitions for zero-latency submission handling.
 *
 * @returns React element rendering the hunt setup form.
 */
export default function HuntSetup(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  // Fetching the pokemon again to ensure I have the name and image for the UI and backend payload
  const { data: pokemon, isLoading } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonById(id as string),
    enabled: !!id,
  });

  /**
   * React 19 Form Action handler. Validates data and submits it to the Express backend via the hunts service.
   *
   * @param formData - Native FormData object automatically provided by React 19.
   * @returns An asynchronous promise tracking the submission transition.
   */
  const handleCreateHunt = async (formData: FormData): Promise<void> => {
    if (!pokemon) return;

    startTransition(async () => {
      try {
        await createShinyHunt({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          gameGeneration: formData.get('gameGeneration') as string,
          huntMethod: formData.get('huntMethod') as string,
          encounters: 0,
          hasShinyCharm: formData.get('hasShinyCharm') === 'on',
          startDate: new Date().toISOString(),
        });

        // Redirect to the active hunts dashboard upon database success
        navigate('/hunts');
      } catch (err) {
        console.error('Failed to initialize the hunt:', err);
      }
    });
  };

  if (isLoading || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Preparing Hunt Environment...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Loading Pokémon configurations...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-8 md:p-10 transition-colors duration-300">
        <div className="text-center mb-8">
          <img
            src={getPokemonImageURL(pokemon.id)}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto object-contain drop-shadow-md mb-4"
          />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize transition-colors duration-300">
            Hunt Setup: {pokemon.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
            Configure your target parameters to begin tracking.
          </p>
        </div>

        <form action={handleCreateHunt} className="flex flex-col gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="gameGeneration"
              className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide"
            >
              Game Generation
            </label>
            <select
              name="gameGeneration"
              id="gameGeneration"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            >
              <option value="">Select a Generation</option>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((gen) => (
                <option key={gen} value={gen}>
                  Generation {gen}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="huntMethod"
              className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide"
            >
              Hunting Method
            </label>
            <select
              name="huntMethod"
              id="huntMethod"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            >
              <option value="">Select a Method</option>
              <option value="Random Encounter">Random Encounter</option>
              <option value="Soft Reset">Soft Reset</option>
              <option value="Masuda Method">Masuda Method</option>
              <option value="Poke Radar">Poke Radar</option>
              <option value="Chain Fishing">Chain Fishing</option>
              <option value="DexNav">DexNav</option>
              <option value="SOS Chaining">SOS Chaining</option>
              <option value="Catch Combo">Catch Combo</option>
              <option value="Mass Outbreak">Mass Outbreak</option>
              <option value="Overworld">Overworld</option>
            </select>
          </div>

          {/* Shiny Charm Toggle */}
          <div className="flex items-center space-x-3 pt-2 pl-1">
            <input
              type="checkbox"
              id="hasShinyCharm"
              name="hasShinyCharm"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600 transition-colors cursor-pointer"
            />
            <label
              htmlFor="hasShinyCharm"
              className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              I have the Shiny Charm
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className={`
                w-full font-bold text-lg py-4 px-6 rounded-xl shadow-md transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800
                ${
                  isPending
                    ? 'bg-gray-400 dark:bg-slate-600 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:-translate-y-1 hover:shadow-lg'
                }
              `}
            >
              {isPending ? 'Saving to Database...' : 'Initialize Hunt Tracker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
