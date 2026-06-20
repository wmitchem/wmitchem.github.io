import mongoose from "mongoose";
import readLine from "readline";

const host = process.env.DB_HOST || "127.0.0.1";
const dbURI = `mongodb://${host}/travlr`;

// Build the connection string and set the connection timeout.
// Timeout is in milliseconds (ms).
const connect = (): void => {
  setTimeout(() => {
    mongoose.connect(dbURI);
  }, 1000);
};

// Monitor connection events
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Mongoose connection error: ", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Windows specific listener
if (process.platform === "win32") {
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  r1.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

// Configure for Graceful Shutdown
const gracefulShutdown = (msg: string): void => {
  // We don't need a callback inside close() in newer Mongoose versions,
  // but if you want to be safe and strict, you can handle it as a promise:
  mongoose.connection.close().then(() => {
    console.log(`Mongoose disconnected through ${msg}`);
  });
};

// Event listeners to process graceful shutdowns

// Shutdown invoked by nodemon signal
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart");
  process.kill(process.pid, "SIGUSR2");
});

// Shutdown invoked by app termination
process.on("SIGINT", () => {
  gracefulShutdown("app termination");
  process.exit(0);
});

// Shutdown invoked by container termination
process.on("SIGTERM", () => {
  gracefulShutdown("app shutdown");
  process.exit(0);
});

// Make initial connection to DB
connect();

// Import Mongoose schemas
// Thanks to "allowJs": true, TS will happily execute your remaining .js files!
import "./trip";
import "./shinyHunt";
import "./pokemon";
import "./user";

export default mongoose;
