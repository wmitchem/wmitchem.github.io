import type { AppPokemon } from '../types/AppPokemon';

/**
 * Transforms raw PokeAPI JSON data into the streamlined AppPokemon format.
 * This implements the Adapter Pattern to decouple the UI from external API schemas.
 *
 * @param pokemonRaw - The unformatted JSON object from the /pokemon PokeAPI endpoint.
 * @param speciesRaw - The unformatted JSON object from the /pokemon-species PokeAPI endpoint.
 * @returns A formatted AppPokemon object ready for use in the UI and cache.
 */
export const mapPokeApiToAppPokemon = (
  pokemonRaw: any,
  speciesRaw: any,
  abilitiesRaw: any[],
): AppPokemon => {
  return {
    id: pokemonRaw.id,
    // Formatting the name to be capitalized for a more professional UI look
    name: pokemonRaw.name.charAt(0).toUpperCase() + pokemonRaw.name.slice(1),

    // Mapping the types array into a strictly typed tuple [string] | [string, string]
    // PokeAPI returns types as an array of objects; I just need the names.
    types: pokemonRaw.types.map((t: any) => t.type.name) as
      | [string]
      | [string, string],

    // Weight is returned in hectograms, height in decimeters; converting to kg and m
    weight: pokemonRaw.weight / 10,
    height: pokemonRaw.height / 10,

    // Fetching the generation and region from the /pokemon-species API
    generation: speciesRaw.generation.name,

    // Reducing the complex stats array into a single, flat object for easy sorting
    stats: {
      hp: pokemonRaw.stats.find((s: any) => s.stat.name === 'hp').base_stat,
      attack: pokemonRaw.stats.find((s: any) => s.stat.name === 'attack')
        .base_stat,
      defense: pokemonRaw.stats.find((s: any) => s.stat.name === 'defense')
        .base_stat,
      specialAttack: pokemonRaw.stats.find(
        (s: any) => s.stat.name === 'special-attack',
      ).base_stat,
      specialDefense: pokemonRaw.stats.find(
        (s: any) => s.stat.name === 'special-defense',
      ).base_stat,
      speed: pokemonRaw.stats.find((s: any) => s.stat.name === 'speed')
        .base_stat,
    },

    // Transforming the abilities array to include the name and the hidden flag
    abilities: abilitiesRaw.map((abilityRaw: any) => {
      // PokeAPI returns an array of flavor text in different languages and game versions.
      // I want to find the first one that is in English.
      const englishEntry = abilityRaw.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en',
      );

      return {
        name: abilityRaw.name.replace('-', ' '), // Formats 'shield-dust' to 'shield dust'

        // Removing weird newline characters (\n, \f) that PokeAPI leaves in their strings
        description: englishEntry
          ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ')
          : 'No description available.',

        // Checking the original pokemonRaw to see if this is a hidden ability
        isHidden:
          pokemonRaw.abilities.find(
            (a: any) => a.ability.name === abilityRaw.name,
          )?.is_hidden || false,
      };
    }),
  };
};

/**
 * Helper function to derive the region from the PokeAPI generation string.
 */
const getRegionFromGeneration = (generationName: string): string => {
  const regions: Record<string, string> = {
    'generation-i': 'Kanto',
    'generation-ii': 'Johto',
    'generation-iii': 'Hoenn',
    'generation-iv': 'Sinnoh',
    'generation-v': 'Unova',
    'generation-vi': 'Kalos',
    'generation-vii': 'Alola',
    'generation-viii': 'Galar',
    'generation-ix': 'Paldea',
  };

  return regions[generationName] || 'Unknown';
};
