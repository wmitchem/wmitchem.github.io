import React, {
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from 'react';
import type { ShinyHunt, HuntEncounterAction } from '@capstone/shared';
import {
  getAllHunts,
  catchShinyHunt,
  updateHuntEncounters,
} from '../services/hunt-api';
import { HuntCard } from '../features/pokemon/components/HuntCard';

interface HuntsDashboardState {
  hunts: ShinyHunt[];
  isLoading: boolean;
  error: string | null;
}

type HuntUpdateAction = { type: 'catch'; id: string };

/**
 * The primary dashboard component for managing and viewing Shiny Hunts.
 * Acts as the Data Orchestrator, passing state and mutation callbacks down to presentation cards.
 *
 * @returns The rendered Hunts Dashboard page.
 */
export default function HuntsDashboard(): React.JSX.Element {
  const [state, setState] = useState<HuntsDashboardState>({
    hunts: [],
    isLoading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // --- OPTIMISTIC REDUCER ---
  // Now strictly handles the single "Catch" interaction since encounters are purely authoritative
  const [optimisticHunts, dispatchOptimisticUpdate] = useOptimistic<
    ShinyHunt[],
    HuntUpdateAction
  >(state.hunts, (currentHunts, action) => {
    return currentHunts.map((h) => {
      if (h._id === action.id && action.type === 'catch') {
        return { ...h, isCaught: true, endDate: new Date().toISOString() };
      }
      return h;
    });
  });

  // --- DERIVED STATE (TAB FILTERING) ---
  const activeHunts = optimisticHunts.filter((hunt) => !hunt.isCaught);
  const completedHunts = optimisticHunts.filter((hunt) => hunt.isCaught);
  const displayedHunts = activeTab === 'active' ? activeHunts : completedHunts;

  // --- DATA FETCHING ---
  useEffect(() => {
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

  // --- ACTION HANDLERS ---
  const handleEncounterUpdate = (
    huntId: string,
    actionType: HuntEncounterAction,
  ): void => {
    const targetHunt = state.hunts.find((h) => h._id === huntId);
    if (
      !targetHunt ||
      (actionType === 'decrement' && targetHunt.encounters <= 0)
    )
      return;

    // Instantly update the permanent state (Client-Authoritative)
    setState((prev) => ({
      ...prev,
      hunts: prev.hunts.map((h) => {
        if (h._id !== huntId) return h;

        if (actionType === 'incrementChain') {
          const currentChain = h.chainCount || 0;
          const newChain = currentChain < 40 ? currentChain + 1 : currentChain;
          const newHighest = Math.max(h.highestChain || 0, newChain);
          return {
            ...h,
            encounters: h.encounters + 1,
            chainCount: newChain,
            highestChain: newHighest,
          };
        }

        if (actionType === 'breakChain') {
          // Add the guaranteed-failure encounter to the total tally
          const newEncounters = h.encounters + 1;

          const historySnapshot = {
            chainLength: h.chainCount || 0,
            totalEncountersAtBreak: newEncounters,
            timestamp: new Date().toISOString(),
          };

          return {
            ...h,
            encounters: newEncounters,
            chainCount: 0,
            chainBreaks: (h.chainBreaks || 0) + 1,
            chainHistory: [...(h.chainHistory || []), historySnapshot],
          };
        }

        if (actionType === 'increment') {
          return { ...h, encounters: h.encounters + 1 };
        }

        if (actionType === 'decrement') {
          return { ...h, encounters: Math.max(0, h.encounters - 1) };
        }

        return h;
      }),
    }));

    // "Fire and Forget" the API sync in the background
    updateHuntEncounters(huntId, actionType).catch((err) => {
      console.error(
        'Failed to sync encounter update. Server/Client mismatch.',
        err,
      );
    });
  };

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

  // --- RENDER LOGIC ---
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
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Hunting Dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track active encounters or view your completed collection log.
        </p>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Active Hunts ({activeHunts.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600 dark:text-green-400 dark:border-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Completed ({completedHunts.length})
          </button>
        </nav>
      </div>

      {/* HUNT CARDS GRID */}
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
            <HuntCard
              key={hunt._id}
              hunt={hunt}
              activeTab={activeTab}
              onEncounterUpdate={handleEncounterUpdate}
              onCatch={handleCatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
