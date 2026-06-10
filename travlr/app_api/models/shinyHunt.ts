// app_api/models/shinyHunt.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import type { ShinyHunt } from "@capstone/shared";
import { GAME_GENERATIONS, HUNT_METHODS } from "@capstone/shared";

export interface IShinyHuntDocument
  extends Omit<ShinyHunt, "_id" | "userId">, Document {
  userId: Types.ObjectId;
}

const shinyHuntSchema = new Schema<IShinyHuntDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    pokemonId: { type: Number, required: true },
    pokemonName: { type: String, required: true },
    gameGeneration: { type: Number, enum: GAME_GENERATIONS, required: true },
    huntMethod: { type: String, enum: HUNT_METHODS, required: true },
    encounters: { type: Number, default: 0, min: 0 },
    isCaught: { type: Boolean, default: false },
    hasShinyCharm: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
  },
  { timestamps: true },
);

export const ShinyHuntModel = mongoose.model<IShinyHuntDocument>(
  "ShinyHunt",
  shinyHuntSchema,
);
