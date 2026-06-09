const mongoose = require("mongoose");
const Pokemon = require("./pokemon");

// Database Connection Setup
const MONGODB_URI = "mongodb://localhost:27017/travlr";

// Helper Function to determine Generation based on Pokemon ID
function getGeneration(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  if (id <= 1025) return 9;
  return 10;
}

const getBaseStat = (statsArray, statName) => {
  const statObj = statsArray.find((s) => s.stat.name === statName);
  return Number(statObj?.base_stat) || 0;
};

async function processSinglePokemon(p, index) {
  const pokemonId = index + 1;

  // Fetch individual data
  const detailResponse = await fetch(p.url);
  const detailData = await detailResponse.json();

  const speciesResponse = await fetch(detailData.species.url);
  const speciesData = await speciesResponse.json();

  const englishNameEntry = speciesData.names.find(
    (entry) => entry.language.name === "en",
  );

  const name = englishNameEntry ? englishNameEntry.name : detailData.name;
  const types = detailData.types.map((t) => t.type.name);
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

  const abilityPromises = detailData.abilities.map((abilityItem) =>
    fetch(abilityItem.ability.url).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch ability: ${res.status}`);
      return res.json();
    }),
  );

  const abilitiesRaw = await Promise.all(abilityPromises);

  const abilities = abilitiesRaw.map((abilityData) => {
    const englishEntry = abilityData.flavor_text_entries.find(
      (entry) => entry.language.name === "en",
    );

    const englishName = abilityData.names.find(
      (entry) => entry.language.name === "en",
    );

    return {
      name: englishName.name || abilityData.name,
      description: englishEntry
        ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
        : "No description available.",
      isHidden:
        detailData.abilities.find((a) => a.ability.name === abilityData.name)
          ?.is_hidden || false,
    };
  });

  return {
    id: pokemonId,
    name: name,
    types: types,
    generation: getGeneration(pokemonId),
    stats: stats,
    weight: weight,
    height: height,
    abilities: abilities,
  };
}

// The Core ETL (Extract, Transform, Load) Function
async function seedPokemonDatabase() {
  try {
    console.log("Connecting to MongoDB.");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database.");

    console.log("Clearing existing Pokemon collection.");
    await Pokemon.deleteMany({});

    console.log("Fetching data from PokeAPI.");
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1025",
    );
    const data = await response.json();
    const pokemonList = data.results;

    const transformedData = [];
    const BATCH_SIZE = 50; // Process 50 Pokemon concurrently

    console.log(
      `Processing ${pokemonList.length} Pokemon in batches of ${BATCH_SIZE}...`,
    );

    // The Batching Loop
    for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
      // Slicing out the current chunk of 50
      const batch = pokemonList.slice(i, i + BATCH_SIZE);

      // Map the chunk to the async processing function
      // I pass `i + index` so the internal IDs remain accurate
      const batchPromises = batch.map((p, index) =>
        processSinglePokemon(p, i + index),
      );

      // Await all 50 network requests simultaneously
      const batchResults = await Promise.all(batchPromises);

      // Pushing the resolved chunk into the main array
      transformedData.push(...batchResults);

      console.log(
        `...Processed up to Pokemon #${Math.min(i + BATCH_SIZE, pokemonList.length)}`,
      );
    }

    console.log("Saving transformed data to MongoDB...");
    await Pokemon.insertMany(transformedData);

    console.log("Seeding Complete! Process finished.");
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
