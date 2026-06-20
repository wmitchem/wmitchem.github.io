import type { Pokemon } from '@capstone/shared';
import { PokemonCard } from './PokemonCard';

/**
 * The properties required to render the PokemonGrid.
 * By accepting loading and error states as props rather than managing them internally,
 * this component remains completely detached from the network layer.
 */
interface PokemonGridProps {
  /**
   * The filtered, sorted, and paginated array of Pokémon ready for display.
   */
  pokemonList: Pokemon[];

  /**
   * Indicates if the parent container is currently awaiting the primary dataset from the Express API.
   * Passed down so I can render a loading screen without blocking the parent's navigation tools.
   */
  isLoading: boolean;

  /**
   * Indicates if the parent container's network request failed (e.g., the server is offline).
   */
  isError: boolean;
}

/**
 * A purely presentational ("dumb") component responsible for rendering the main layout grid.
 *
 * I specifically decoupled this from the data-fetching logic to enforce Separation of Concerns.
 * Rather than having each individual card fetch its own data (which would cause N+1 network requests),
 * the parent controller passes the fully resolved array down here. This component's only job is to
 * evaluate the macroscopic application state (Loading, Error, Empty, or Populated) and gracefully
 * render the appropriate UI layout.
 *
 * @param props - The PokemonGridProps state variables passed down from the parent controller.
 * @example
 * <PokemonGrid
 * pokemonList={paginatedPokemonArray}
 * isLoading={isNetworkLoading}
 * isError={hasFetchFailed}
 * />
 */
export const PokemonGrid = ({
  pokemonList,
  isLoading,
  isError,
}: PokemonGridProps): React.JSX.Element => {
  // Handle the macroscopic network loading state
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

  // Handle server rejection or crash states
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

  // Render the final layout (either the mapped grid, or an empty state warning)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemonList.length > 0 ? (
        pokemonList.map((pokemon) => (
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
  );
};
