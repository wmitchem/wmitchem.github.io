// app.ts
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

// Wire in the authentication module
import passport from "passport";
import "./app_api/config/passport.js";

// Bring in the database
import "./app_api/models/db.js";

// Bring in the single, unified API Router
import apiRouter from "./app_api/routes/index.js";

// ES Modules __dirname workaround
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment variables
dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

// Enable CORS with dynamic origin whitelist
const allowedOrigins = ["http://localhost:4200", "http://localhost:5173"];

app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// Catch unauthorized error and create 401
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  } else {
    next(err);
  }
});

app.use("/api", apiRouter);

// Fallback error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "API Endpoint Not Found" });
});

export default app;
