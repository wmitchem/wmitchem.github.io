const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const huntsController = require("../controllers/shinyHunts");
const pokemonController = require("../controllers/pokemon");

function authenticateJWT(req, res, next) {
  // console.log('In Middleware');

  const authHeader = req.headers["authorization"];
  // console.log('Auth Header: ' + authHeader);

  if (authHeader == null) {
    console.log("Auth Header required but NOT PRESENT");
    return res.sendStatus(401);
  }

  let headers = authHeader.split(" ");
  if (headers.length < 1) {
    console.log("Not enough tokens in Auth Header: " + headers.length);
    return res.sendStatus(501);
  }

  const token = authHeader.split(" ")[1];
  // console.log('Token: ' + token)

  if (token == null) {
    console.log("Null bearer token");
    return res.sendStatus(401);
  }

  // console.log(process.env.JWT_SECRET);

  // console.log(jwt.decode(token));
  const verified = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, verified) => {
      if (err)
        return res.sendStatus(401).json({ message: "Token validation error!" });
      req.auth = verified;
    },
  );

  next();
}

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// Define router for trips endpoint
router
  .route("/trips")
  .get(tripsController.tripsList) // GET method routes tripList
  .post(authenticateJWT, tripsController.tripsAddTrip); // POST method adds a trip

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter
router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

// ============================================
// ShinyHunt Routing
// ============================================

// Base routes for fetching and creating hunts
router
  .route("/hunts")
  .get(authenticateJWT, huntsController.listUserHunts)
  .post(authenticateJWT, huntsController.addHunt);

// Route for rapidly incrementing and decrementing an encounter counter via the UI
router
  .route("/hunts/:huntId/encounter")
  .patch(authenticateJWT, huntsController.updateEncounters);

// Route for marking a hunt as successfully caught
router
  .route("/hunts/:huntId/catch")
  .patch(authenticateJWT, huntsController.catchHunt);

// Route for deleting a hunt
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

module.exports = router;
