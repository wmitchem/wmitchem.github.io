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

const handleStandardHunt = (hunt: any, action: string) => {
  if (action === "increment") hunt.encounters += 1;
  else if (action === "decrement" && hunt.encounters > 0) hunt.encounters -= 1;
  else throw new Error("Invalid action for standard hunt.");
};

const handlePokeradarHunt = (hunt: any, action: string) => {
  if (action === "incrementChain") {
    hunt.encounters += 1;
    const currentChain = hunt.chainCount || 0;
    if (currentChain < 40) {
      hunt.chainCount = currentChain + 1;
      if (hunt.chainCount > (hunt.highestChain || 0))
        hunt.highestChain = hunt.chainCount;
    }
  } else if (action === "breakChain") {
    if (hunt.chainCount && hunt.chainCount > 0) {
      hunt.encounters += 1;

      hunt.chainHistory.push({
        chainLength: hunt.chainCount,
        totalEncountersAtBreak: hunt.encounters,
        timestamp: new Date(),
      });
    }
    hunt.chainCount = 0;
    hunt.chainBreaks = (hunt.chainBreaks || 0) + 1;
  } else {
    // Fallback to allow basic increment/decrement if needed
    handleStandardHunt(hunt, action);
  }
};

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
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const hunt = await ShinyHuntModel.findOne({
          _id: huntId,
          userId: req.auth._id,
        });
        if (!hunt)
          return void res.status(404).json({ message: "Hunt not found." });

        // Passing the document object by reference to be mutated safely
        try {
          if (hunt.huntMethod === "Poke Radar") {
            handlePokeradarHunt(hunt, action);
          } else {
            handleStandardHunt(hunt, action);
          }
        } catch (logicError: any) {
          return void res.status(400).json({ message: logicError.message });
        }

        // Saving the mutated document
        const updatedHunt = await hunt.save();
        return void res.status(200).json(updatedHunt);
      } catch (saveError: any) {
        if (saveError.name === "VersionError") {
          if (attempt === MAX_RETRIES)
            return void res.status(409).json({ message: "System busy." });
          continue;
        }
        throw saveError;
      }
    }
  } catch (error) {
    console.error("Error updating encounters:", error);
    res.status(500).json({ message: "Server error." });
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
