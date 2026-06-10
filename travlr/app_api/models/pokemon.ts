// app_api/models/pokemon.ts
import mongoose, { Schema, Document } from "mongoose";
import type { Pokemon } from "@capstone/shared";

export interface IPokemonDocument extends Omit<Pokemon, "_id">, Document {}

const pokemonSchema = new Schema<IPokemonDocument>(
  {
    // The unique PokeAPI identifier (handles variants > 10000)
    id: { type: Number, required: true, unique: true, index: true },

    // The National Dex number (allows duplicates for regional forms)
    dexNumber: { type: Number, required: true, index: true },

    name: { type: String, required: true, index: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    generation: { type: Number, required: true },
    types: [{ type: String, required: true }],
    stats: {
      hp: { type: Number, required: true },
      attack: { type: Number, required: true },
      defense: { type: Number, required: true },
      specialAttack: { type: Number, required: true },
      specialDefense: { type: Number, required: true },
      speed: { type: Number, required: true },
    },
    abilities: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        isHidden: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { timestamps: true, collection: "pokemon" },
);

export const PokemonModel = mongoose.model<IPokemonDocument>(
  "pokemon",
  pokemonSchema,
);
