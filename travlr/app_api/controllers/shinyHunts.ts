// app_api/controllers/shinyHunts.ts
import { Response } from "express";
import { ShinyHuntModel, IShinyHuntDocument } from "../models/shinyHunt.js";
import { ShinyHunt } from "@capstone/shared";
import { AuthRequest } from "../models/AuthRequest.js";

/**
 * GET: Retrieve all active hunts for the logged-in user
 */
export const listUserHunts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const hunts = await ShinyHuntModel.find({ userId: req.auth._id }).exec();
    res.status(200).json(hunts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hunts", error: err });
  }
};

/**
 * POST: Create a new Shiny Hunt
 */
export const addHunt = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Explicitly cast the incoming body to ensure it matches the shared interface
    const huntData = req.body as Partial<ShinyHunt>;

    const newHunt = await ShinyHuntModel.create({
      userId: req.auth._id,
      pokemonId: huntData.pokemonId,
      pokemonName: huntData.pokemonName,
      gameGeneration: huntData.gameGeneration,
      huntMethod: huntData.huntMethod,
      encounters: huntData.encounters || 0,
      startDate: huntData.startDate,
      hasShinyCharm: huntData.hasShinyCharm,
    });

    res.status(201).json(newHunt);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Validation error creating hunt", error: err });
  }
};

/**
 * PATCH: Hunt encounter atomic increment/decrement
 */
export const updateEncounters = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const huntId = req.params.huntId as string;
    const { action } = req.body;

    let incValue = 0;
    if (action === "increment") incValue = 1;
    else if (action === "decrement") incValue = -1;
    else {
      res.status(400).json({ message: "Invalid action." });
      return;
    }

    // Must match the hunt ID AND belong to the logged-in user!
    // We type the query filter explicitly to allow the conditional '$gt' addition below
    const queryFilter: any = { _id: huntId, userId: req.auth._id };

    // Prevent negative numbers
    if (incValue === -1) {
      queryFilter.encounters = { $gt: 0 };
    }

    const updatedHunt = await ShinyHuntModel.findOneAndUpdate(
      queryFilter,
      { $inc: { encounters: incValue } },
      { new: true, runValidators: true },
    );

    if (!updatedHunt) {
      res.status(404).json({
        message: "Hunt not found, unauthorized, or encounters at zero.",
      });
      return;
    }

    res.status(200).json(updatedHunt);
  } catch (error) {
    console.error("Error updating encounters:", error);
    res
      .status(500)
      .json({ message: "Server error while updating encounters." });
  }
};

/**
 * PATCH: Mark a hunt as caught
 */
export const catchHunt = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Update the boolean flag, ensuring the user owns it
    const caughtHunt = await ShinyHuntModel.findOneAndUpdate(
      { _id: req.params.huntId as string, userId: req.auth._id },
      { isCaught: true },
      { new: true },
    );

    if (!caughtHunt) {
      res.status(404).json({ message: "Hunt not found or unauthorized." });
      return;
    }

    res.status(200).json(caughtHunt);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating catch status", error: err });
  }
};

/**
 * DELETE: Remove a hunt completely
 */
export const deleteHunt = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // findOneAndDelete ensures the user owns it
    const hunt = await ShinyHuntModel.findOneAndDelete({
      _id: req.params.huntId as string,
      userId: req.auth._id,
    }).exec();

    if (!hunt) {
      res.status(404).json({ message: "Hunt not found or unauthorized" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting hunt", error: err });
  }
};
