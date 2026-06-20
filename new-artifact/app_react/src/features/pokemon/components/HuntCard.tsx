import React, { memo } from 'react';
import type { ShinyHunt, HuntEncounterAction } from '@capstone/shared';
import { getPokemonShinyImageURL } from '../utils/spriteFetcher';
import { calculateActiveHuntProbability } from '../utils/probability';
import { EncounterOddsMeter } from './EncounterOddsMeter';
import { DetailsAccordion } from '../../../components/ui/DetailsAccordion';

interface HuntCardProps {
  hunt: ShinyHunt;
  activeTab: 'active' | 'completed';
  onEncounterUpdate: (huntId: string, actionType: HuntEncounterAction) => void;
  onCatch: (huntId: string) => void;
}

export const HuntCard = memo(function HuntCard({
  hunt,
  activeTab,
  onEncounterUpdate,
  onCatch,
}: HuntCardProps): React.JSX.Element {
  const rawOdds = calculateActiveHuntProbability(hunt);
  const oddsPercentage = isNaN(rawOdds) ? '0.00' : (rawOdds * 100).toFixed(2);
  const isCompleted = activeTab === 'completed';

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition-all duration-300 ${
        isCompleted
          ? 'border-green-200 dark:border-green-900/50'
          : 'border-gray-200 dark:border-slate-700'
      }`}
    >
      {/* IMAGE */}
      <div
        className={`flex justify-center items-center rounded-lg p-4 mb-4 transition-colors duration-300 ${
          isCompleted
            ? 'bg-green-50 dark:bg-green-900/20'
            : 'bg-gray-50 dark:bg-slate-900/50'
        }`}
      >
        <img
          src={getPokemonShinyImageURL(hunt.pokemonId)}
          alt={`Shiny ${hunt.pokemonName}`}
          draggable={false}
          className="w-24 h-24 object-contain drop-shadow-md"
        />
      </div>

      {/* HEADER INFO */}
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

      {/* ENCOUNTERS & ODDS METER */}
      <EncounterOddsMeter
        encounters={hunt.encounters}
        oddsPercentage={oddsPercentage}
        isCompleted={isCompleted}
      />

      {/* RADAR METRICS ACCORDION */}
      {hunt.huntMethod === 'Poke Radar' && (
        <DetailsAccordion title="View Chain Metrics">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-gray-100 dark:border-slate-700">
              <span className="block text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                Current
              </span>
              <span className="block text-base font-bold text-gray-800 dark:text-gray-100">
                {hunt.chainCount || 0}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-gray-100 dark:border-slate-700">
              <span className="block text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                Peak
              </span>
              <span className="block text-base font-bold text-gray-800 dark:text-gray-100">
                {hunt.highestChain || 0}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-red-100 dark:border-red-900/30">
              <span className="block text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                Breaks
              </span>
              <span className="block text-base font-bold text-red-600 dark:text-red-400">
                {hunt.chainBreaks || 0}
              </span>
            </div>
          </div>
        </DetailsAccordion>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 mt-auto pt-4">
        {!isCompleted ? (
          <>
            {hunt.huntMethod === 'Poke Radar' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEncounterUpdate(hunt._id, 'breakChain')}
                  disabled={!hunt.chainCount || hunt.chainCount === 0}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-bold py-2 px-3 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Break Chain
                </button>
                <button
                  onClick={() => onEncounterUpdate(hunt._id, 'incrementChain')}
                  disabled={hunt.chainCount === 40}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Chain +1
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onEncounterUpdate(hunt._id, 'decrement')}
                disabled={hunt.encounters <= 0}
                className="bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => onEncounterUpdate(hunt._id, 'increment')}
                className="flex-grow bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
              >
                +1 Encounter
              </button>
            </div>
            <button
              onClick={() => onCatch(hunt._id)}
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
  );
});
