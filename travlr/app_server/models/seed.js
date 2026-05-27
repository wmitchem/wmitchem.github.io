// Bring in the DB connection and the Trip schema
const Mongoose = require("../../app_api/models/db");
const Trip = require("../../app_api/models/travlr");

// Read seed data from json file
var fs = require("fs");
var trips = JSON.parse(fs.readFileSync("../data/trips.json", "utf8"));

// Delete any existing records, then insert the seed data
const seedDB = async () => {
  await Trip.deleteMany({});
  await Trip.insertMany(trips);
};

// Close the MongoDB connection and exit
seedDB().then(async () => {
  await Mongoose.connection.close();
  process.exit(0);
});
