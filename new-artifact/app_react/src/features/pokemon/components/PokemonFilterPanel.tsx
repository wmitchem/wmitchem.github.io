import { POKEMON_TYPES, GAME_GENERATIONS } from '@capstone/shared';
import type { PokedexFilterKey } from '../models/PokedexFilterKey';

/**
 * Properties for the PokemonFilterPanel component.
 * I explicitly pass all active filter states down as props from the parent
 * controller to maintain a single source of truth (the URL search parameters).
 */
interface PokemonFilterPanelProps {
  /** The currently selected primary Pokémon type (e.g., 'fire', or 'All'). */
  activeType1: string;
  /** The currently selected secondary Pokémon type. */
  activeType2: string;
  /** The currently selected game generation (e.g., '1', or 'All'). */
  activeGen: string;
  /** The specific object property the dataset is currently sorted by. */
  sortField: string;
  /** The chronological direction of the sort ('asc' or 'desc'). */
  sortDirection: string;
  /**
   * Callback fired when any dropdown value changes.
   * Locked to PokedexFilterKey to prevent typos or silent state bugs.
   *
   * @param key - The strictly-typed filter parameter to update.
   * @param value - The new string or numeric value selected by the user.
   */
  onFilterChange: (key: PokedexFilterKey, value: string | number) => void;
}

const SORT_OPTIONS = [
  { label: 'Pokédex Number', value: 'dexNumber' },
  { label: 'Weight', value: 'weight' },
  { label: 'Height', value: 'height' },
  { label: 'HP', value: 'stats.hp' },
  { label: 'Attack', value: 'stats.attack' },
  { label: 'Defense', value: 'stats.defense' },
  { label: 'Special Attack', value: 'stats.specialAttack' },
  { label: 'Special Defense', value: 'stats.specialDefense' },
  { label: 'Speed', value: 'stats.speed' },
];

/**
 * A presentational ("dumb") component that renders the advanced filtering and sorting dropdowns.
 *
 * I extracted this massive block of JSX out of the main database page to vastly improve
 * code readability and adhere to the Single Responsibility Principle. Because this component
 * is stateless, it relies entirely on the parent controller to tell it what the current
 * active filters are. When a user makes a selection, it fires the `onFilterChange` callback,
 * utilizing strict TypeScript union types to guarantee that only valid mutation keys are
 * passed back up the component tree.
 *
 * @param props - The PokemonFilterPanelProps containing active states and the change handler.
 * * @example
 * <PokemonFilterPanel
 * activeType1="fire"
 * activeType2="All"
 * activeGen="1"
 * sortField="dexNumber"
 * sortDirection="asc"
 * onFilterChange={updateFilterUrl}
 * />
 */
export const PokemonFilterPanel = ({
  activeType1,
  activeType2,
  activeGen,
  sortField,
  sortDirection,
  onFilterChange,
}: PokemonFilterPanelProps): React.JSX.Element => {
  return (
    <>
      {/* --- Filter Dropdowns (Top Row) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary Type Filter */}
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
            onChange={(e) => onFilterChange('type1', e.target.value)}
          >
            <option value="All">Any Type</option>
            {POKEMON_TYPES.map((type) => (
              <option key={`t1-${type}`} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Secondary Type Filter */}
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
            onChange={(e) => onFilterChange('type2', e.target.value)}
          >
            <option value="All">Any Type</option>
            {POKEMON_TYPES.map((type) => (
              <option key={`t2-${type}`} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Generation Filter */}
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
            onChange={(e) => onFilterChange('gen', e.target.value)}
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

      {/* --- Sorting Dropdowns (Bottom Row) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        {/* Sort Field */}
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
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Direction */}
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
            onChange={(e) => onFilterChange('dir', e.target.value)}
          >
            <option value="asc">Ascending (Low to High)</option>
            <option value="desc">Descending (High to Low)</option>
          </select>
        </div>
      </div>
    </>
  );
};
