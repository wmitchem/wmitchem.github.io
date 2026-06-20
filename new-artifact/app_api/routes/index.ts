import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Use ESM star imports since we converted the controllers to named exports!
// Don't forget the .js extensions for strict ESM resolution
import * as tripsController from "../controllers/trips.js";
import * as authController from "../controllers/authentication.js";
import * as huntsController from "../controllers/shinyHunts.js";
import * as pokemonController from "../controllers/pokemon.js";
import { AuthRequest } from "../models/AuthRequest.js";

const router = express.Router();

/**
 * Authentication Middleware
 * Validates the JWT Bearer token before allowing access to protected routes.
 */
function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Auth Header required but NOT PRESENT");
    res.sendStatus(401);
    return;
  }

  const headers = authHeader.split(" ");
  if (headers.length < 2) {
    console.log("Not enough tokens in Auth Header: " + headers.length);
    res.sendStatus(501);
    return;
  }

  const token = headers[1];

  if (!token) {
    console.log("Null bearer token");
    res.sendStatus(401);
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "thisIsSecret";

    // Synchronously verify the token. If it fails, it throws to the catch block.
    const verified = jwt.verify(token, secret);

    // Cast the generic Request to our custom AuthRequest to safely attach the payload
    (req as AuthRequest).auth = verified as any;

    // Only proceed to the controller if verification was successful!
    next();
  } catch (err) {
    console.log("Token validation error");
    res.status(401).json({ message: "Token validation error!" });
    return;
  }
}

// ============================================
// Authentication Routing
// ============================================
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// ============================================
// Trips Routing
// ============================================
router
  .route("/trips")
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

// ============================================
// ShinyHunt Routing
// ============================================
router
  .route("/hunts")
  .get(authenticateJWT, huntsController.listUserHunts)
  .post(authenticateJWT, huntsController.addHunt);

router
  .route("/hunts/:huntId/encounter")
  .patch(authenticateJWT, huntsController.updateEncounters);

router
  .route("/hunts/:huntId/catch")
  .patch(authenticateJWT, huntsController.catchHunt);

router
  .route("/hunts/:huntId")
  .delete(authenticateJWT, huntsController.deleteHunt);

// ============================================
// Pokemon Caching Routing
// ============================================
router
  .route("/pokemon")
  .get(pokemonController.listPokemon)
  .post(pokemonController.cachePokemon);

router.route("/pokemon/:id").get(pokemonController.getPokemonById);

export default router;
