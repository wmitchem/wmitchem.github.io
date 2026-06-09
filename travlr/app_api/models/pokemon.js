const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema(
  {
    // Using the official National Dex number as a unique identifier
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true, // Indexed for fast search queries by name
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    generation: {
      type: Number,
      required: true,
    },
    // Types can be an array of strings (e.g., ['Fire', 'Flying'])
    types: [
      {
        type: String,
        required: true,
      },
    ],
    stats: {
      hp: Number,
      attack: Number,
      defense: Number,
      specialAttack: Number,
      specialDefense: Number,
      speed: Number,
    },
    abilities: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        isHidden: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "pokemon",
  },
);

const Pokemon = mongoose.model("pokemon", pokemonSchema);
module.exports = Pokemon;
