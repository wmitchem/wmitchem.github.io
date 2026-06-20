/**
 * Interface representing the detailed Pokémon data for the collection tracker.
 * This structure supports independent tracking of normal/shiny variants and
 * provides complex data for advanced sorting and filtering.
 */
export interface Pokemon {
  /** MongoDB internal ID */
  _id?: string;
  /** PokeAPI's unique identifier (e.g., 10100 for Alolan Raichu */
  id: number;
  /** The national Pokédex ID. (NOT UNIQUE: VARIANTS SHARE IT) */
  dexNumber: number;
  /** The name of the Pokémon species. */
  name: string;
  /**
   * The Pokémon's types.
   * Constrained to a tuple to ensure at least one type and at most two,
   * reflecting the core mechanics of the Pokémon games.
   */
  types: [string] | [string, string];
  /** The generation this Pokémon was introduced in. */
  generation: number;
  /** The weight of the Pokémon in kilograms. */
  weight: number;
  /** The height of the Pokémon in meters. */
  height: number;
  /**
   * Nested object containing the base combat statistics.
   * This complex structure allows for advanced sorting (e.g., by Base Stat Total).
   */
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  /**
   * List of abilities, including a flag for hidden abilities.
   * Using objects with a hidden property adds technical depth for filtering logic.
   */
  abilities: {
    name: string;
    description: string;
    isHidden: boolean; // Differentiates regular vs. hidden abilities
  }[];
}
