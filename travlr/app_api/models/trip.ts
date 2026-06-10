import mongoose, { Schema, Document } from "mongoose";
import type { Trip } from "@capstone/shared";

export interface ITripDocument extends Omit<Trip, "_id">, Document {}

const tripSchema = new Schema<ITripDocument>({
  code: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  length: { type: String, required: true },
  start: { type: Date, required: true },
  perPerson: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

export const TripModel = mongoose.model<ITripDocument>("trips", tripSchema);
