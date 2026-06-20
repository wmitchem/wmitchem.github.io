import { Request, Response } from "express";
import { PokemonModel } from "../models/pokemon.js";
import { Pokemon } from "@capstone/shared";

/**
 * GET: Retrieve a specific Pokemon by its Pokedex ID
 */
export const getPokemonById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pokemonId = parseInt(req.params.id as string);

    // Letting TS infer the Mongoose Document type here
    const pokemon = await PokemonModel.findOne({ id: pokemonId }).exec();

    if (!pokemon) {
      res.status(404).json({ message: "Pokemon not found in cache" });
      return;
    }

    res.status(200).json(pokemon);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pokemon", error: err });
  }
};

/**
 * GET: Search or list all Pokemon
 */
export const listPokemon = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Mongoose returns an IPokemonDocument array. res.json() will automatically
    // serialize the native ObjectId into a standard string for the React frontend
    const pokemonList = await PokemonModel.find().sort({ id: 1 }).exec();

    res.status(200).json(pokemonList);
  } catch (err) {
    res.status(500).json({ message: "Error listing pokemon", error: err });
  }
};

/**
 * POST: Add a new Pokemon to the cache
 */
export const cachePokemon = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pokemonData = req.body as Pokemon;

    const cachedPokemon = await PokemonModel.findOneAndUpdate(
      { id: pokemonData.id },
      pokemonData,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    res.status(201).json(cachedPokemon);
  } catch (err) {
    console.error("DATABASE INGESTION ERROR:", err);
    res.status(400).json({ message: "Error caching pokemon", error: err });
  }
};
