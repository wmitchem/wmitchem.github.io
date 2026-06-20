import React, { useState } from 'react';
import { Link } from 'react-router';
import type { Pokemon } from '@capstone/shared';
import { getPokemonImageURL } from '../utils/spriteFetcher';
import { PokeballPlaceholder } from './PokeballPlaceholder';

interface PokemonCardProps {
  pokemon: Pokemon;
}

/**
 * A presentation component that renders a single Pokemon's basic information.
 *
 * @param props - The properties passed to the component.
 * @returns The rendered card element.
 */
export const PokemonCard = ({
  pokemon,
}: PokemonCardProps): React.JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const getTypeIconPath = (typeName: string): string => {
    return `/assets/images/types/${typeName.toLowerCase()}.png`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg border border-gray-200 dark:border-slate-700 transition-all duration-300 overflow-hidden">
      {/* Image Container (MUST be relative so the absolute placeholder stays inside it) */}
      {/* Added a min-height (min-h-[11rem]) so the card doesn't shrink/jump while loading */}
      <div className="relative flex justify-center items-center p-6 min-h-[11rem] bg-gray-50 dark:bg-slate-900/50">
        {/* Render the placeholder if the image is loading, or if it threw a 404 error */}
        {(!isImageLoaded || hasImageError) && (
          <div className="absolute inset-0 flex justify-center items-center z-0">
            <PokeballPlaceholder
              className={`w-24 h-24 transition-all duration-300 ${
                hasImageError
                  ? 'opacity-10 grayscale' // Dead image (Error)
                  : 'opacity-30 animate-pulse' // Downloading (Loading)
              }`}
            />
          </div>
        )}

        {/* The actual image */}
        {pokemon.id && !hasImageError && (
          <Link to={`/pokemon/${pokemon.id}`} className="block z-10">
            <img
              src={getPokemonImageURL(pokemon.id)}
              alt={pokemon.name}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setHasImageError(true)}
              draggable={false}
              className={`w-32 h-32 object-contain drop-shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-3 hover:rotate-2 hover:scale-110 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </Link>
        )}
      </div>

      {/* --- Card Body (Your exact original text and layout) --- */}
      <div className="flex flex-col flex-grow p-4 text-center border-t border-gray-100 dark:border-slate-700">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase block mb-1">
          #{String(pokemon.dexNumber).padStart(3, '0')}
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
                draggable={false}
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
