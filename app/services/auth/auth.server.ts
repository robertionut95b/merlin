import type { Role, User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import invariant from "tiny-invariant";
import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { sessionStorage } from "~/session.server";
import { validateEmail } from "../utils";

export let authenticator = new Authenticator<
  User & {
    role?: Role;
  }
>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    invariant(typeof email === "string", "Email must be a string");
    invariant(email.length > 0, "Email must not be empty");
    invariant(validateEmail(email), "Email must be a valid email");

    invariant(typeof password === "string", "Password must be a string");
    invariant(password.length > 0, "Password must not be empty");

    var user = await verifyLogin(email, password);

    if (!user || user === null || user === undefined) {
      return createUser(email, password);
    }

    return user;
  }),
  "user-pass"
);

if (
  process.env.GITHUB_CLIENT_ID !== undefined &&
  process.env.GITHUB_CLIENT_SECRET !== undefined &&
  process.env.GITHUB_CALLBACK_URL !== undefined
) {
  authenticator.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async ({ profile }) => {
        const email = profile?.emails?.[0].value || "";
        var user = await getUserByEmail(email);

        if (!user || user === null || user === undefined) {
          return createUser(email, "abcdefghijklmno");
        }

        return user;
      }
    ),
    "github"
  );
}
