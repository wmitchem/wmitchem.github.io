import type {
  GameGeneration,
  HuntMethod,
  ShinyHunt,
  ChainHistoryEntry,
} from '@capstone/shared';

/**
 * Calculates the true chance of seeing at least one shiny patch
 * across the 4 Poke Radar grass patches.
 * This accounts for the game mechanic where patches further away have a
 * higher chance of continuing the chain.
 *
 * @param baseOdds - The decimal base shiny odds for the current chain length.
 * @returns The total probability of a shiny patch appearing on this radar use.
 */
export const calculateTrueRadarProbability = (baseOdds: number): number => {
  const pRing1 = baseOdds * 0.28;
  const pRing2 = baseOdds * 0.48;
  const pRing3 = baseOdds * 0.68;
  const pRing4 = baseOdds * 0.88;

  const chanceOfAllFailing =
    (1 - pRing1) * (1 - pRing2) * (1 - pRing3) * (1 - pRing4);

  return 1 - chanceOfAllFailing;
};

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
 * @returns The cumulative probability as a decimal (e.g., 0.15 for 15%).
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

/**
 * Builds an array of odds representing an entire Poke Radar hunt's history.
 * Since the database only saves the peak chain length and total encounters,
 * this assumes the player chained perfectly to their highest chain, and any
 * extra encounters were just radar resets done at those peak odds.
 *
 * @param currentChain - The player's current active chain count.
 * @param currentEncounters - The total encounters on the current active run.
 * @param chainHistory - An array of previously broken chain records.
 * @returns A flat array of decimal probabilities representing every radar reset.
 */
const buildComprehensiveRadarHistory = (
  currentChain: number,
  currentEncounters: number,
  chainHistory: ChainHistoryEntry[] = [],
): number[] => {
  const historyArray: number[] = [];

  if (currentEncounters === 0) return historyArray;

  let accountedEncounters = 0;

  // We add an 'isBroken' flag to handle the guaranteed-failure encounter
  const processChainPhase = (
    chainLength: number,
    encountersInThisPhase: number,
    isBroken: boolean,
  ) => {
    // If this chain broke, the very last encounter was the breaker (0% shiny chance).
    // I subtract it from the valid mathematical pool to prevent inflating the odds.
    const validEncounters = isBroken
      ? encountersInThisPhase - 1
      : encountersInThisPhase;

    if (validEncounters <= 0) return;

    // The player climbs up to the chain length, OR the valid encounters they had
    const climbsToProcess = Math.min(chainLength + 1, validEncounters);

    for (let i = 0; i < climbsToProcess; i++) {
      const baseOdds = Math.ceil(65535 / (8200 - i * 200)) / 65536;
      historyArray.push(calculateTrueRadarProbability(baseOdds));
    }

    // Any leftover encounters in this phase were spent resetting at the peak
    const resetsInThisPhase = validEncounters - climbsToProcess;

    if (resetsInThisPhase > 0) {
      const maxAchievedBaseOdds =
        Math.ceil(65535 / (8200 - chainLength * 200)) / 65536;
      const maxAchievedRadarOdds =
        calculateTrueRadarProbability(maxAchievedBaseOdds);

      for (let i = 0; i < resetsInThisPhase; i++) {
        historyArray.push(maxAchievedRadarOdds);
      }
    }
  };

  const sortedHistory = [...chainHistory].sort((a, b) => {
    return a.totalEncountersAtBreak - b.totalEncountersAtBreak;
  });

  sortedHistory.forEach((historyItem) => {
    const encountersInThisRun =
      historyItem.totalEncountersAtBreak - accountedEncounters;

    // I pass TRUE because this is in the history array, meaning the chain definitively broke here.
    processChainPhase(historyItem.chainLength, encountersInThisRun, true);

    accountedEncounters = historyItem.totalEncountersAtBreak;
  });

  const leftoverEncounters = currentEncounters - accountedEncounters;
  if (leftoverEncounters > 0) {
    // I pass FALSE because this is the currently active chain (It hasn't broken yet.)
    processChainPhase(currentChain, leftoverEncounters, false);
  }

  return historyArray;
};

/**
 * Calculates the total cumulative probability for any given Shiny Hunt.
 * This acts as a wrapper that checks the hunt method (e.g., Poke Radar vs
 * Random Encounter) and runs the data through the correct probability formula.
 *
 * @param hunt - The ShinyHunt document from the database.
 * @returns The cumulative probability as a decimal.
 */
export const calculateActiveHuntProbability = (hunt: ShinyHunt): number => {
  const baseRate = getBaseShinyRate(hunt.gameGeneration, hunt.hasShinyCharm);

  switch (hunt.huntMethod) {
    case 'Poke Radar': {
      // Use the helper to rebuild the array, then pass to the existing math function
      const historyArray = buildComprehensiveRadarHistory(
        hunt.chainCount || 0,
        hunt.encounters,
        hunt.chainHistory,
      );
      return calculateVariableCumulativeProbability(historyArray);
    }

    // TODO: Plug in new methods (Masuda, Chain Fishing) here later
    case 'Random Encounter':
    case 'Soft Reset':
    case 'Masuda Method':
    case 'DexNav':
    case 'SOS Chaining':
    case 'Catch Combo':
    case 'Mass Outbreak':
    case 'Overworld': {
      // Standard static odds: 1 - (1 - p)^n
      return 1 - Math.pow(1 - baseRate, hunt.encounters);
    }
    default:
      return 0;
  }
};
