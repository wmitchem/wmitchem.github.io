export type HuntMethod =
  | "Random Encounter"
  | "Soft Reset"
  | "Masuda Method"
  | "Poke Radar"
  | "DexNav"
  | "SOS Chaining"
  | "Catch Combo"
  | "Mass Outbreak"
  | "Overworld";

// Adding a specific type for the generation to enforce type safety
// Generation 1 did not have shiny pokemon
export type GameGeneration = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ShinyHunt {
  _id: string;
  userId: string;
  pokemonId: number;
  pokemonName: string;
  gameGeneration: GameGeneration;
  huntMethod: HuntMethod;
  encounters: number;
  hasShinyCharm: boolean;
  isCaught: boolean;
  startDate: string | Date;
  endDate?: string | Date;
}
