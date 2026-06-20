import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserModel } from "./user.js";
import { ShinyHuntModel } from "./shinyHunt.js";

// Initialize environment variables
dotenv.config();

// Database Connection Setup
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/travlr";

/**
 * Seeds the database with specific evaluator/professor data.
 *
 * This script ensures a clean slate by removing any existing user data
 * tied to the professor's email, generates a new user profile with a hashed
 * password, and injects a diverse set of dummy Shiny Hunts. This allows
 * the evaluator to immediately test the application's CRUD features and
 * view populated dashboards without manual setup.
 *
 * @returns Promise<void> Resolves when the database seeding completes and disconnects.
 */
async function seedProfessorData(): Promise<void> {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database.");

    const professorEmail = "professor@snhu.edu";
    const plainTextPassword = "snhu";

    console.log("Cleaning up old professor data...");
    const existingUser = await UserModel.findOne({
      email: professorEmail,
    }).exec();

    if (existingUser) {
      await ShinyHuntModel.deleteMany({ userId: existingUser._id }).exec();
      await UserModel.deleteOne({ email: professorEmail }).exec();
    }

    // Generating the professor account
    console.log("Generating professor account...");
    const professorUser = new UserModel({
      name: "Dr. Penmatsa",
      email: professorEmail,
      password: "", // Handled by setPassword
    });

    // Hash and salt the password using the strongly-typed instance method
    professorUser.setPassword(plainTextPassword);

    const savedUser = await professorUser.save();
    console.log(`Professor user created successfully:`);
    console.log(`   Email: ${savedUser.email}`);
    console.log(`   Password: ${plainTextPassword}`);

    // Generating tracked dummy hunts mapped to the new user's BSON ObjectId
    console.log("Generating tracked shiny hunts...");

    // Using native Date objects to strictly satisfy the TypeScript interface
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    const dummyHunts = [
      {
        userId: savedUser._id,
        pokemonId: 384,
        pokemonName: "Rayquaza",
        gameGeneration: 3,
        huntMethod: "Soft Reset",
        encounters: 4092,
        hasShinyCharm: false,
        isCaught: false,
        startDate: today,
      },
      {
        userId: savedUser._id,
        pokemonId: 133,
        pokemonName: "Eevee",
        gameGeneration: 9,
        huntMethod: "Masuda Method",
        encounters: 312,
        hasShinyCharm: true,
        isCaught: false,
        startDate: today,
      },
      {
        userId: savedUser._id,
        pokemonId: 130,
        pokemonName: "Gyarados",
        gameGeneration: 2,
        huntMethod: "Random Encounter",
        encounters: 8192,
        hasShinyCharm: false,
        isCaught: true,
        startDate: fiveDaysAgo,
        endDate: today,
      },
    ];

    // Bulk insert the hunts
    await ShinyHuntModel.insertMany(dummyHunts);
    console.log(
      `Successfully seeded ${dummyHunts.length} shiny hunts into the database.`,
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
seedProfessorData();
