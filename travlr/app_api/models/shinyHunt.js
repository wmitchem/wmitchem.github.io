const mongoose = require("mongoose");
const {
  GAME_GENERATIONS,
  HUNT_METHODS,
} = require("../config/pokemonConstants");

const shinyHuntSchema = new mongoose.Schema(
  {
    // Tying the hunt to the specific user via their internal MongoDB _id
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    pokemonId: {
      type: Number,
      required: true,
    },
    pokemonName: {
      type: String,
      required: true,
    },
    // Strict schema validation using enums
    gameGeneration: {
      type: Number,
      enum: GAME_GENERATIONS,
      required: true,
    },
    huntMethod: {
      type: String,
      enum: HUNT_METHODS,
      required: true,
    },
    encounters: {
      type: Number,
      default: 0,
      min: 0,
    },
    isCaught: {
      type: Boolean,
      default: false,
    },
    hasShinyCharm: {
      type: Boolean,
      default: false,
    },
    shinySpriteUrl: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const ShinyHunt = mongoose.model("shinyhunts", shinyHuntSchema);
module.exports = ShinyHunt;
