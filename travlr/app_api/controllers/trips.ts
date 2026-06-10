// app_api/controllers/trips.ts
import { Request, Response } from "express";
import { TripModel } from "../models/trip.js";
import { AuthRequest } from "../models/AuthRequest.js";
import type { Trip } from "@capstone/shared"; // Import the shared shape!

/**
 * GET: Return a list of all trips
 */
export const tripsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const trips = await TripModel.find({}).exec();

    if (!trips || trips.length === 0) {
      res.status(404).json({ message: "No trips found" });
      return;
    }

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

/**
 * GET: Return a single trip by code
 */
export const tripsFindByCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const trip = await TripModel.find({ code: req.params.tripCode }).exec();

    if (!trip || trip.length === 0) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error finding trip", error });
  }
};

/**
 * POST: Add a new trip (Protected)
 */
export const tripsAddTrip = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // 1. Defensively check auth
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 2. Cast the incoming body to the strict shared interface
    const newTripData = req.body as Trip;

    const newTrip = await TripModel.create(newTripData);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(400).json({ message: "Error adding trip", error });
  }
};

/**
 * PUT: Update an existing trip (Protected)
 */
export const tripsUpdateTrip = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // 1. Defensively check auth
    if (!req.auth?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const tripCode = req.params.tripCode as string;
    const updateData = req.body as Partial<Trip>; // Partial allows partial updates

    const updatedTrip = await TripModel.findOneAndUpdate(
      { code: tripCode },
      updateData,
      { new: true, runValidators: true },
    ).exec();

    if (!updatedTrip) {
      res.status(404).json({ message: "Trip not found for update" });
      return;
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(400).json({ message: "Error updating trip", error });
  }
};
