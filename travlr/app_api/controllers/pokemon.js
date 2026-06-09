const mongoose = require("mongoose");
const Pokemon = mongoose.model("pokemon");

// GET: Retrieve a specific Pokemon by its Pokedex ID
const getPokemonById = async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const pokemon = await Pokemon.findOne({ id: pokemonId }).exec();

    if (!pokemon) {
      // 404 means the frontend should trigger a PokeAPI fetch,
      // format it, and POST it back to the cache
      return res.status(404).json({ message: "Pokemon not found in cache" });
    }

    return res.status(200).json(pokemon);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching pokemon", error: err });
  }
};

// GET: Search or list Pokemon
const listPokemon = async (req, res) => {
  try {
    // You can easily extend this to accept query parameters for filtering
    const pokemonList = await Pokemon.find().sort({ id: 1 }).exec();
    return res.status(200).json(pokemonList);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error listing pokemon", error: err });
  }
};

// POST: Add a new Pokemon to the cache after formatting it from PokeAPI
const cachePokemon = async (req, res) => {
  try {
    // Use findOneAndUpdate with upsert: true.
    // This prevents duplicate key errors if two users trigger a fetch
    // for the exact same Pokemon at the exact same time (Race Condition mitigation).
    const cachedPokemon = await Pokemon.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    return res.status(201).json(cachedPokemon);
  } catch (err) {
    console.error("🔴 DATABASE INGESTION ERROR:", err);
    return res
      .status(400)
      .json({ message: "Error caching pokemon", error: err });
  }
};

module.exports = {
  getPokemonById,
  listPokemon,
  cachePokemon,
};
