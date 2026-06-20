import { Request, Response } from "express";
import passport from "passport";
import { UserModel, IUserDocument } from "../models/user.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure for cleaner access
    const { name, email, password } = req.body;

    // Validate message to ensure that all parameters are present
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }

    // Instantiate the strongly-typed Mongoose model
    const user = new UserModel({
      name,
      email,
    });

    user.setPassword(password);
    const savedUser = await user.save();

    if (!savedUser) {
      // Database returned no data
      res.status(400).json({ message: "Failed to register user" });
      return;
    }

    // Generate token
    const token = savedUser.generateJwt();
    res.status(200).json({ token });
  } catch (error: any) {
    // Defensive try/catch to prevent server crashes on duplicate emails
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  // Validate message to ensure that email and password are present
  if (!email || !password) {
    res.status(400).json({ message: "All fields required" });
    return;
  }

  // Delegate authentication to passport module
  passport.authenticate(
    "local",
    (err: any, user: IUserDocument | false, info: any) => {
      if (err) {
        // Error in authentication process
        res.status(404).json(err);
        return;
      }

      if (user) {
        // Auth succeeded - generate JWT and return to caller
        const token = user.generateJwt();
        res.status(200).json({ token });
      } else {
        // Auth failed return error
        res.status(401).json(info);
      }
    },
  )(req, res);
};
