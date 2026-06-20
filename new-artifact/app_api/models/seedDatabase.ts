import mongoose from "mongoose";
import { PokemonModel } from "./pokemon.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/travlr";
const BATCH_SIZE = 50; // Process 50 Pokemon concurrently to respect API limits

// Helper Function to determine Generation based on Dex Number
function getGeneration(dexNumber: number): number {
  if (dexNumber <= 151) return 1;
  if (dexNumber <= 251) return 2;
  if (dexNumber <= 386) return 3;
  if (dexNumber <= 493) return 4;
  if (dexNumber <= 649) return 5;
  if (dexNumber <= 721) return 6;
  if (dexNumber <= 809) return 7;
  if (dexNumber <= 905) return 8;
  if (dexNumber <= 1025) return 9;
  return 10;
}

const getBaseStat = (statsArray: any[], statName: string): number => {
  const statObj = statsArray.find((s: any) => s.stat.name === statName);
  return Number(statObj?.base_stat) || 0;
};

async function processSinglePokemon(url: string) {
  // Fetching base data
  const detailResponse = await fetch(url);
  const detailData = await detailResponse.json();

  // Extracting Unique ID and National Dex Number
  const uniqueId = detailData.id;
  const dexNumberUrl = detailData.species.url;
  const parsedDexNumber = parseInt(dexNumberUrl.split("/").slice(-2, -1)[0]);

  // Fetching species data for English localization
  const speciesResponse = await fetch(dexNumberUrl);
  const speciesData = await speciesResponse.json();

  const englishNameEntry = speciesData.names.find(
    (entry: any) => entry.language.name === "en",
  );

  const name = englishNameEntry ? englishNameEntry.name : detailData.name;
  const types = detailData.types.map((t: any) => t.type.name);
  const weight = detailData.weight / 10;
  const height = detailData.height / 10;

  const stats = {
    hp: getBaseStat(detailData.stats, "hp"),
    attack: getBaseStat(detailData.stats, "attack"),
    defense: getBaseStat(detailData.stats, "defense"),
    specialAttack: getBaseStat(detailData.stats, "special-attack"),
    specialDefense: getBaseStat(detailData.stats, "special-defense"),
    speed: getBaseStat(detailData.stats, "speed"),
  };

  // Fetching all abilities concurrently for this specific Pokemon
  const abilityPromises = detailData.abilities.map((abilityItem: any) =>
    fetch(abilityItem.ability.url).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch ability: ${res.status}`);
      return res.json();
    }),
  );
  const abilitiesRaw = await Promise.all(abilityPromises);

  const abilities = abilitiesRaw.map((abilityData: any) => {
    const englishEntry = abilityData.flavor_text_entries.find(
      (entry: any) => entry.language.name === "en",
    );

    const englishName = abilityData.names.find(
      (entry: any) => entry.language.name === "en",
    );

    return {
      name: englishName?.name || abilityData.name, // Safely fallback if missing
      description: englishEntry
        ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
        : "No description available.",
      isHidden:
        detailData.abilities.find(
          (a: any) => a.ability.name === abilityData.name,
        )?.is_hidden || false,
    };
  });

  return {
    id: uniqueId, // E.g., 10100 for regional variants
    dexNumber: parsedDexNumber, // E.g., 26
    name: name,
    types: types,
    generation: getGeneration(parsedDexNumber),
    stats: stats,
    weight: weight,
    height: height,
    abilities: abilities,
  };
}

// The Core ETL (Extract, Transform, Load) Pipeline
async function seedPokemonDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database.");

    console.log(
      "Clearing existing Pokemon collection to prevent duplicates...",
    );
    await PokemonModel.deleteMany({});

    console.log("Fetching master list from PokeAPI...");
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1300",
    );
    const data = await response.json();
    const pokemonList = data.results;

    const transformedData = [];

    console.log(
      `Processing ${pokemonList.length} Pokemon in batches of ${BATCH_SIZE}...`,
    );

    // The Throttled Concurrency Loop
    for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
      const batch = pokemonList.slice(i, i + BATCH_SIZE);

      // We just pass the URL into the processor now
      const batchPromises = batch.map((p: any) => processSinglePokemon(p.url));

      const batchResults = await Promise.all(batchPromises);
      transformedData.push(...batchResults);

      console.log(
        `...Processed up to Pokemon #${Math.min(i + BATCH_SIZE, pokemonList.length)}`,
      );
    }

    console.log(
      "Saving transformed data to MongoDB. This might take a moment...",
    );
    await PokemonModel.insertMany(transformedData);

    console.log(
      "Seeding Complete! Database is fully populated with normalized data.",
    );
  } catch (error) {
    console.error("Error during seeding process:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  }
}

// Execute the seeder
seedPokemonDatabase();
