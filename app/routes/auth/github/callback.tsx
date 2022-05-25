import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("github", request, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
};
