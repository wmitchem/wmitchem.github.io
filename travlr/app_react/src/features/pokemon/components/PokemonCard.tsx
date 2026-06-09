import React from 'react';
import { Link } from 'react-router-dom';
import type { AppPokemon } from '../types/AppPokemon';
import { getPokemonImageURL } from '../utils/spriteFetcher';

interface PokemonCardProps {
  pokemon: AppPokemon;
}

/**
 * A presentation component that renders a single Pokemon's basic information.
 *
 * @param {PokemonCardProps} props - The properties passed to the component.
 * @returns {React.JSX.Element} The rendered card element.
 */
export const PokemonCard = ({
  pokemon,
}: PokemonCardProps): React.JSX.Element => {
  const getTypeIconPath = (typeName: string): string => {
    return `/assets/images/types/${typeName.toLowerCase()}.png`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg border border-gray-200 dark:border-slate-700 transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="flex justify-center items-center p-6 bg-gray-50 dark:bg-slate-900/50">
        {pokemon.id ? (
          <Link to={`/pokemon/${pokemon.id}`} className="block">
            <img
              src={getPokemonImageURL(pokemon.id)}
              alt={pokemon.name}
              className="w-32 h-32 object-contain drop-shadow-sm duration-300 hover:-translate-y-3 hover:rotate-2 hover:scale-110 transition-transform"
            />
          </Link>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-4 text-center border-t border-gray-100 dark:border-slate-700">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase block mb-1">
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize m-0">
          {pokemon.name}
        </h3>

        {/* Render Type Icons dynamically */}
        {pokemon.types && (
          <div className="flex flex-col justify-center items-center gap-2 mt-auto pt-4">
            {pokemon.types.map((type) => (
              <img
                key={type}
                src={getTypeIconPath(type)}
                alt={`${type} Type`}
                className="h-8 w-auto object-contain drop-shadow-sm transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                style={{ imageRendering: 'pixelated' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
