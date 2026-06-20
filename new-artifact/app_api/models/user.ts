import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { User } from "@capstone/shared";

// 1. Extend the base User with backend-only secret fields
export interface IUserDocument extends User, Document {
  hash: string;
  salt: string;
  setPassword(password: string): void;
  validPassword(password: string): boolean;
  generateJwt(): string;
}

// 2. Define the strict schema
const userSchema = new Schema<IUserDocument>({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  hash: String,
  salt: String,
});

// 3. Type the instance methods
userSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJwt = function (): string {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  // Fallback to a default secret if the env variable is missing during compilation
  const secret = process.env.JWT_SECRET || "thisIsSecret";

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: Math.floor(expiry.getTime() / 1000), // UNIX timestamp
    },
    secret,
  );
};

export const UserModel = mongoose.model<IUserDocument>("users", userSchema);
