import { Request } from "express";

export interface AuthRequest extends Request {
  auth?: {
    _id: string;
    email: string;
    name: string;
  };
}
