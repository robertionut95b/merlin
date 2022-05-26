import type { Role, User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { EmailLinkStrategy } from "remix-auth-email-link";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import invariant from "tiny-invariant";
import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { sessionStorage } from "~/session.server";
import { sendEmail } from "../email/email.server";
import { validateEmail } from "../utils";

export type UserWithRole = User & { role?: Role };

export let authenticator = new Authenticator<UserWithRole>(sessionStorage);

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

if (
  process.env.SMTP_MAIL_API_KEY !== undefined &&
  process.env.SMTP_MAIL_API_KEY !== "" &&
  process.env.MAGIC_LINK_SECRET !== undefined &&
  process.env.MAGIC_LINK_SECRET !== ""
) {
  const secret = process.env.MAGIC_LINK_SECRET;

  authenticator.use(
    new EmailLinkStrategy(
      { sendEmail, secret, callbackURL: "/magic" },
      // In the verify callback,
      // you will receive the email address, form data and whether or not this is being called after clicking on magic link
      // and you should return the user instance
      async ({
        email,
        form,
        magicLinkVerify,
      }: {
        email: string;
        form: FormData;
        magicLinkVerify: boolean;
      }) => {
        var user = await getUserByEmail(email);

        if (!user || user === null || user === undefined) {
          return createUser(email, "abcdefghijklmno");
        }

        return user;
      }
    ),
    "email-link"
  );
}
