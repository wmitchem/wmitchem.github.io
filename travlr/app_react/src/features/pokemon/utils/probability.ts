import type { GameGeneration, HuntMethod } from '@capstone/shared';

/**
 * Determines the base shiny rate fraction based on the game's generation and active items.
 *
 * @param generation - The game generation the hunt is taking place in.
 * @param hasShinyCharm - Boolean indicating if the user has the Shiny Charm.
 * @returns The fractional base odds (e.g., 1/8192 or 3/4096).
 */
export const getBaseShinyRate = (
  generation: GameGeneration,
  hasShinyCharm: boolean,
): number => {
  // Gens 2, 3, 4 and 5 use the classic 1/8192 odds.
  // (Note: Shiny Charm did not exist before Gen 5.)
  if ([2, 3, 4, 5].includes(generation)) {
    // The Shiny Charm adds 2 extra "rolls", effectively making it 3/8192.
    if (generation == 5 && hasShinyCharm) {
      return 3 / 8192;
    }
    return 1 / 8192;
  }

  // Gen 6 onwards uses the modern 1/4096 odds.
  // The Shiny Charm adds 2 extra "rolls", effectively making it 3/4096.
  if (hasShinyCharm) {
    return 3 / 4096;
  }

  return 1 / 4096;
};

/**
 * Calculates the cumulative probability of at least one successful encounter
 * when the odds change per encounter (e.g., Pokeradar chaining).
 *
 * @param oddsPerEncounter - An array of decimal probabilities for each step in the chain.
 * For example: [1/4096, 1/4096, ..., 1/99]
 * @returns {number} - The cumulative probability as a decimal (e.g., 0.15 for 15%).
 */
export const calculateVariableCumulativeProbability = (
  oddsPerEncounter: number[],
): number => {
  // If the array is empty, there is a 0% chance of getting a shiny
  if (oddsPerEncounter.length === 0) return 0;

  // Calculate the probability of NOT getting a shiny on every single encounter
  const chanceOfNeverGettingShiny = oddsPerEncounter.reduce(
    (accumulator, currentOdds) => {
      const chanceOfFailingThisEncounter = 1 - currentOdds;
      return accumulator * chanceOfFailingThisEncounter;
    },
    1,
  );

  // The chance of getting AT LEAST one shiny is the exact opposite of NEVER getting one
  return 1 - chanceOfNeverGettingShiny;
};
