import mongoose from "./db.js";
import { TripModel } from "./trip.js"; // Use the named export from your TS model
import fs from "fs";
import type { Trip } from "@capstone/shared";

const rawData = fs.readFileSync("../data/trips.json", "utf8");

const trips: Trip[] = JSON.parse(rawData);

const seedDB = async (): Promise<void> => {
  try {
    console.log("Clearing existing trips from the database...");
    await TripModel.deleteMany({});

    console.log(`Injecting ${trips.length} trips into the database...`);
    await TripModel.insertMany(trips);

    console.log("Trips seeded successfully!");
  } catch (error) {
    console.error("Error during trip seeding process:", error);
  }
};

seedDB().then(async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed.");
  process.exit(0);
});
