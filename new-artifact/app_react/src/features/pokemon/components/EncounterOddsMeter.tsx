import React from 'react';

interface EncounterOddsMeterProps {
  /** The current number of encounters. */
  encounters: number;
  /** The calculated cumulative probability formatted as a percentage string. */
  oddsPercentage: string;
  /** Determines if the hunt is active or completed to style the encounter number accordingly. */
  isCompleted: boolean;
}

/**
 * Displays the current encounter count alongside a dynamic probability progress bar.
 * Visually alerts the user when they have crossed the 80% "over odds" threshold.
 */
export const EncounterOddsMeter = ({
  encounters,
  oddsPercentage,
  isCompleted,
}: EncounterOddsMeterProps): React.JSX.Element => {
  // Dynamic styling variables extracted for cleaner JSX
  const encountersColor = isCompleted
    ? 'text-green-600 dark:text-green-400'
    : 'text-blue-600 dark:text-blue-400';
  const isOverOdds = Number(oddsPercentage) >= 80;
  const oddsColor = isOverOdds
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <div className="relative overflow-hidden mt-4 mb-2 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 transition-colors duration-300">
      {/* The dynamic probability progress bar */}
      <div
        className="absolute left-0 bottom-0 h-1 bg-yellow-400 dark:bg-yellow-500 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Number(oddsPercentage), 100)}%` }}
      />

      <div className="flex justify-between items-end relative z-10">
        <div className="text-left text-gray-800 dark:text-gray-200 font-bold">
          <span className={`text-2xl ${encountersColor}`}>{encounters}</span>{' '}
          <span className="text-sm">Encounters</span>
        </div>

        <div className="text-right flex flex-col">
          <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Cumulative Odds
          </span>
          <span className={`text-lg font-bold ${oddsColor}`}>
            {oddsPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
