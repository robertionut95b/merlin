import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { sessionStorage } from "~/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, { successRedirect: "/" });
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has("auth:magiclink")) return json({ magicLinkSent: true });
  return json({ magicLinkSent: false });
};

export let action: ActionFunction = async ({ request }) => {
  // The success redirect is required in this action, this is where the user is
  // going to be redirected after the magic link is sent, note that here the
  // user is not yet authenticated, so you can't send it to a private page.
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/login/magic",
    // If this is not set, any error will be throw and the ErrorBoundary will be
    // rendered.
    failureRedirect: "/login/magic",
  });
};

export default function Login() {
  let { magicLinkSent } = useLoaderData<{ magicLinkSent: boolean }>();
  return (
    <Form action="/login/magic" method="post">
      <h1>Log in to your account.</h1>
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" name="email" required />
      </div>
      <button>Email a login link</button>
    </Form>
  );
}
