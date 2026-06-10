import React, {
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from 'react';
import type { ShinyHunt } from '@capstone/shared';
import {
  getAllHunts,
  catchShinyHunt,
  updateHuntEncounters,
} from '../services/hunt-api';
import { getPokemonShinyImageURL } from '../features/pokemon/utils/spriteFetcher';

interface HuntsDashboardState {
  hunts: ShinyHunt[];
  isLoading: boolean;
  error: string | null;
}

type HuntUpdateAction =
  | { type: 'increment' | 'decrement'; id: string }
  | { type: 'catch'; id: string };

/**
 * The primary dashboard component for managing and viewing Shiny Hunts.
 * Displays separate tabs for active and completed hunts, allowing users to increment encounters or mark a Pokémon as caught.
 * @returns The rendered Hunts Dashboard page.
 */
export default function HuntsDashboard(): React.JSX.Element {
  const [state, setState] = useState<HuntsDashboardState>({
    hunts: [],
    isLoading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const [optimisticHunts, dispatchOptimisticUpdate] = useOptimistic<
    ShinyHunt[],
    HuntUpdateAction
  >(state.hunts, (currentHunts, action) => {
    return currentHunts.map((h) => {
      if (h._id === action.id) {
        if (action.type === 'catch') {
          return { ...h, isCaught: true, endDate: new Date().toISOString() };
        }
        const newEncounters =
          action.type === 'increment' ? h.encounters + 1 : h.encounters - 1;
        return { ...h, encounters: newEncounters };
      }
      return h;
    });
  });

  useEffect(() => {
    /**
     * Asynchronously fetches the user's hunt data from the API and updates the local state.
     * Handles both successful data retrieval and error states.
     * * @returns A promise that resolves when the fetch and state update are complete.
     */
    const fetchHunts = async (): Promise<void> => {
      try {
        const data = await getAllHunts();
        setState({ hunts: data, isLoading: false, error: null });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: (err as Error).message,
        }));
      }
    };

    fetchHunts();
  }, []);

  /**
   * Updates the encounter count for a specific active hunt.
   * Uses an optimistic UI update to change the count instantly before the server responds to prevent lag.
   *
   * @param huntId - The unique database ID of the Shiny Hunt being updated.
   * @param actionType - The direction to change the encounter count.
   * @returns {void}
   */
  const handleEncounterUpdate = (
    huntId: string,
    actionType: 'increment' | 'decrement',
  ): void => {
    const targetHunt = state.hunts.find((h) => h._id === huntId);
    if (
      !targetHunt ||
      (actionType === 'decrement' && targetHunt.encounters <= 0)
    )
      return;

    startTransition(async () => {
      dispatchOptimisticUpdate({ type: actionType, id: huntId });

      try {
        await updateHuntEncounters(huntId, actionType);
        setState((prev) => ({
          ...prev,
          hunts: prev.hunts.map((h) =>
            h._id === huntId
              ? {
                  ...h,
                  encounters:
                    actionType === 'increment'
                      ? h.encounters + 1
                      : h.encounters - 1,
                }
              : h,
          ),
        }));
      } catch (err) {
        console.error(`Failed to sync ${actionType} with database:`, err);
      }
    });
  };

  /**
   * Marks a specific Shiny Hunt as successfully caught.
   * Optimistically updates the UI to instantly move the hunt to the completed tab.
   *
   * @param huntId - The unique database ID of the Shiny Hunt that was completed.
   * @returns {void}
   */
  const handleCatch = (huntId: string): void => {
    startTransition(async () => {
      dispatchOptimisticUpdate({ type: 'catch', id: huntId });

      try {
        await catchShinyHunt(huntId);
        setState((prev) => ({
          ...prev,
          hunts: prev.hunts.map((hunt) =>
            hunt._id === huntId ? { ...hunt, isCaught: true } : hunt,
          ),
        }));
      } catch (err) {
        console.error('Failed to update hunt status:', err);
      }
    });
  };

  const activeHunts = optimisticHunts.filter((hunt) => !hunt.isCaught);
  const completedHunts = optimisticHunts.filter((hunt) => hunt.isCaught);

  const displayedHunts = activeTab === 'active' ? activeHunts : completedHunts;

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Loading your hunting logs...
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-10 mt-10">
        <div
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-6 py-4 rounded-xl shadow-sm text-center"
          role="alert"
        >
          <p className="font-bold text-lg mb-1">Failed to Load Dashboard</p>
          <p className="text-sm">{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Hunting Dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track active encounters or view your completed collection log.
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200
              ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            Active Hunts ({activeHunts.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200
              ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600 dark:text-green-400 dark:border-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            Completed ({completedHunts.length})
          </button>
        </nav>
      </div>

      {displayedHunts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 mt-8 transition-colors duration-300">
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium text-center">
            {activeTab === 'active'
              ? 'You have no active hunts. Go to the Database to start one!'
              : "You haven't caught any target Pokémon yet. Keep hunting!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedHunts.map((hunt) => (
            <div
              key={hunt._id}
              className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition-all duration-300
                ${activeTab === 'completed' ? 'border-green-200 dark:border-green-900/50' : 'border-gray-200 dark:border-slate-700'}
              `}
            >
              <div
                className={`flex justify-center items-center rounded-lg p-4 mb-4 transition-colors duration-300
                ${activeTab === 'completed' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-900/50'}
              `}
              >
                <img
                  src={getPokemonShinyImageURL(hunt.pokemonId)}
                  alt={`Shiny ${hunt.pokemonName}`}
                  className="w-24 h-24 object-contain drop-shadow-md"
                />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white capitalize mb-1 transition-colors duration-300">
                {hunt.pokemonName}
              </h3>

              {hunt.hasShinyCharm && (
                <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full mb-2 mx-auto">
                  ✨ Shiny Charm Active
                </span>
              )}

              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                Method: {hunt.huntMethod}
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gen: {hunt.gameGeneration}
              </p>

              <div className="text-lg my-4 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-slate-600 transition-colors duration-300">
                <span
                  className={`text-2xl ${activeTab === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}
                >
                  {hunt.encounters}
                </span>{' '}
                Encounters
              </div>

              <div className="flex flex-col gap-3 mt-auto pt-2">
                {activeTab === 'active' ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEncounterUpdate(hunt._id, 'decrement')
                        }
                        disabled={hunt.encounters <= 0}
                        className="bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -1
                      </button>
                      <button
                        onClick={() =>
                          handleEncounterUpdate(hunt._id, 'increment')
                        }
                        className="flex-grow bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
                      >
                        +1 Encounter
                      </button>
                    </div>

                    <button
                      onClick={() => handleCatch(hunt._id)}
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-sm mt-1 transition-colors"
                    >
                      Caught it!
                    </button>
                  </>
                ) : (
                  <div className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold py-3 px-4 rounded-lg w-full text-center">
                    Successfully Caught!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
