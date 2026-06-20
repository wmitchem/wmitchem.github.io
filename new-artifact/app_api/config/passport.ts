import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (
      username: string,
      password: string,
      done: (error: any, user?: false | any, info?: any) => void,
    ) => {
      try {
        const q = await UserModel.findOne({ email: username }).exec();

        if (!q) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (!q.validPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, q);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
