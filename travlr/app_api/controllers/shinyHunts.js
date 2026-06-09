const mongoose = require("mongoose");
const Hunt = mongoose.model("shinyhunts");

// GET: Retrieve all active hunts for the logged-in user
const listUserHunts = async (req, res) => {
  try {
    const hunts = await Hunt.find({ userId: req.auth._id }).exec();
    return res.status(200).json(hunts);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching hunts", error: err });
  }
};

// POST: Create a new Shiny Hunt
const addHunt = async (req, res) => {
  try {
    const newHunt = await Hunt.create({
      userId: req.auth._id,
      pokemonId: req.body.pokemonId,
      pokemonName: req.body.pokemonName,
      gameGeneration: req.body.gameGeneration,
      huntMethod: req.body.huntMethod,
      encounters: req.body.encounters || 0,
      shinySpriteUrl: req.body.shinySpriteUrl,
      startDate: req.body.startDate,
      hasShinyCharm: req.body.hasShinyCharm,
    });
    return res.status(201).json(newHunt);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Validation error creating hunt", error: err });
  }
};

// PATCH: Hunt encounter atomic increment
const updateEncounters = async (req, res) => {
  try {
    const huntId = req.params.huntId;
    const { action } = req.body;

    let incValue = 0;
    if (action === "increment") incValue = 1;
    else if (action === "decrement") incValue = -1;
    else return res.status(400).json({ message: "Invalid action." });

    // Must match the hunt ID AND belong to the logged-in user!
    const queryFilter = { _id: huntId, userId: req.auth._id };

    // Prevent negative numbers
    if (incValue === -1) {
      queryFilter.encounters = { $gt: 0 };
    }

    const updatedHunt = await Hunt.findOneAndUpdate(
      queryFilter,
      { $inc: { encounters: incValue } },
      { new: true, runValidators: true },
    );

    if (!updatedHunt) {
      return res.status(404).json({
        message: "Hunt not found, unauthorized, or encounters at zero.",
      });
    }

    res.status(200).json(updatedHunt);
  } catch (error) {
    console.error("Error updating encounters:", error);
    res
      .status(500)
      .json({ message: "Server error while updating encounters." });
  }
};

// PATCH: Mark a hunt as caught
const catchHunt = async (req, res) => {
  try {
    // Update the boolean flag, ensuring the user owns it
    const caughtHunt = await Hunt.findOneAndUpdate(
      { _id: req.params.huntId, userId: req.auth._id },
      { isCaught: true },
      { new: true },
    );

    if (!caughtHunt) {
      return res
        .status(404)
        .json({ message: "Hunt not found or unauthorized." });
    }

    res.status(200).json(caughtHunt);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating catch status", error: err });
  }
};

// DELETE: Remove a hunt completely
const deleteHunt = async (req, res) => {
  try {
    // findOneAndDelete ensures the user owns it
    const hunt = await Hunt.findOneAndDelete({
      _id: req.params.huntId,
      userId: req.auth._id,
    }).exec();

    if (!hunt) {
      return res
        .status(404)
        .json({ message: "Hunt not found or unauthorized" });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Error deleting hunt", error: err });
  }
};

module.exports = {
  listUserHunts,
  addHunt,
  updateEncounters,
  catchHunt,
  deleteHunt,
};
