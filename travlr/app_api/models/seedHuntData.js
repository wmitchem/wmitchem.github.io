require("dotenv").config();
const mongoose = require("mongoose");

// Database Connection Setup
const MONGODB_URI = "mongodb://localhost:27017/travlr";

const User = require("../models/user");
const ShinyHunt = require("../models/shinyHunt");

async function seedProfessorData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database.");

    const professorEmail = "professor@snhu.edu";
    const plainTextPassword = "snhu";

    // Removing any existing professor accounts and their hunts to prevent duplicates
    console.log("Cleaning up old professor data...");
    const existingUser = await User.findOne({ email: professorEmail });
    if (existingUser) {
      await ShinyHunt.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ email: professorEmail });
    }

    // Creating the professor user
    console.log("Generating professor account...");
    const professorUser = new User({
      name: "Dr. Penmatsa",
      email: professorEmail,
      // Starting with an empty password string to satisfy schema requirements
      password: "",
    });

    // Ensuring the database stores the salt/hash instead of plain text
    professorUser.setPassword(plainTextPassword);

    const savedUser = await professorUser.save();
    console.log(`Professor user created`);
    console.log(`   Email: ${savedUser.email}`);
    console.log(`   Password: ${plainTextPassword}`);

    // Generating dummy hunts mapped to the professor's unique _id
    console.log("Generating tracked shiny hunts...");
    const today = new Date().toISOString();

    const dummyHunts = [
      {
        userId: savedUser._id,
        pokemonId: 384,
        pokemonName: "Rayquaza",
        gameGeneration: "3",
        huntMethod: "Soft Reset",
        encounters: 4092,
        hasShinyCharm: false,
        isCaught: false,
        startDate: today,
        shinySpriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/384.png",
      },
      {
        userId: savedUser._id,
        pokemonId: 133,
        pokemonName: "Eevee",
        gameGeneration: "9",
        huntMethod: "Masuda Method",
        encounters: 312,
        hasShinyCharm: true,
        isCaught: false,
        startDate: today,
        shinySpriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/133.png",
      },
      {
        userId: savedUser._id,
        pokemonId: 130,
        pokemonName: "Gyarados",
        gameGeneration: "2",
        huntMethod: "Random Encounter",
        encounters: 8192,
        hasShinyCharm: false,
        isCaught: true,
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        endDate: today,
        shinySpriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/130.png",
      },
    ];

    // Bulk inserting the hunts
    await ShinyHunt.insertMany(dummyHunts);
    console.log(
      `Successfully seeded ${dummyHunts.length} shiny hunts into the database`,
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
