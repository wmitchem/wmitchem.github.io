import type { Pokemon } from '@capstone/shared';
import { useState } from 'react';
import { getPokemonImageURL } from '../../features/pokemon/utils/spriteFetcher';

/**
 * Properties for the SearchBarWithSuggestions component.
 * I specifically kept these props generic rather than tying them to a specific
 * domain key (like PokedexFilterKey) so this UI component remains highly reusable.
 */
interface SearchBarWithSuggestionsProps {
  /** * The current text sitting inside the search input box.
   */
  searchTerm: string;

  /**
   * An array of Pokemon objects to display in the autocomplete dropdown.
   * I filter and slice this array down to the top 5 matches in the parent
   * component before passing it down to keep this component "dumb" and fast.
   */
  suggestions: Pokemon[];

  /**
   * Callback fired whenever the user types a keystroke, clears the input,
   * or clicks a specific suggestion from the dropdown list.
   *
   * @param term - The new string the user wants to search for.
   */
  onSearchChange: (term: string) => void;
}

/**
 * A controlled text input component featuring an autocomplete suggestion dropdown.
 *
 * I extracted this out of the main database page because managing the focus state
 * and the absolute-positioned dropdown UI was cluttering up the parent controller.
 * Now, this component just handles the visual DOM interactions and passes the resulting
 * string back up to the parent controller via a callback.
 *
 * @param props - The SearchBarWithSuggestionsProps configuration object.
 * @example
 * <SearchBarWithSuggestions
 * searchTerm={currentSearch}
 * suggestions={topFivePokemon}
 * onSearchChange={(newVal) => updateFilter('search', newVal)}
 * />
 */
export const SearchBarWithSuggestions = ({
  searchTerm,
  suggestions,
  onSearchChange,
}: SearchBarWithSuggestionsProps): React.JSX.Element => {
  // Local UI state to track if the user is currently typing in the box
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  return (
    <div className="relative mb-8 z-30 max-w-3xl mx-auto">
      <div className="flex relative shadow-sm rounded-lg">
        <input
          type="text"
          className="w-full pl-4 pr-12 py-3 text-lg border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />

        {/* Render a clear button (✕) only if there is text to clear */}
        {searchTerm && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors"
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown: Only render if focused AND we have matching suggestions */}
      {isSearchFocused && suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-40">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
              // Using onMouseDown instead of onClick because onBlur (from the input)
              // fires before onClick, which would hide the menu before the click registers
              onMouseDown={() => onSearchChange(suggestion.name)}
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
                Dex #{suggestion.dexNumber}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
