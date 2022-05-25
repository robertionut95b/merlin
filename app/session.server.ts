import { createCookieSessionStorage } from "@remix-run/node";

if (process.env.SESSION_SECRET === undefined) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "merlin_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
