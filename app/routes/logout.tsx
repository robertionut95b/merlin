import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth/auth.server";

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/login" });
};

export const LogoutPage = () => {
  return <></>;
};
