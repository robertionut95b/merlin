import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import NotFoundPage from "./components/navigation/NotFound";
import { MantineProvider } from "@mantine/core";
import AccessUnauthorizedPage from "./components/navigation/AccessUnauthorized";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Merlin App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, { loadUser: true });
};

const App = (): JSX.Element => {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <MantineProvider
          theme={{
            primaryColor: "indigo",
            fontFamily: "inherit",
          }}
        >
          <ModalsProvider>
            <NotificationsProvider>
              <Outlet />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export default ClerkApp(App);

function AppCatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <html>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <NotFoundPage />
        </body>
      </html>
    );
  } else if (caught.status === 401) {
    return (
      <html>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <AccessUnauthorizedPage />
        </body>
      </html>
    );
  } else
    return (
      <div>
        <h1>Caught</h1>
        <p>Status: {caught.status}</p>
        <pre>
          <code>{JSON.stringify(caught.data, null, 2)}</code>
        </pre>
      </div>
    );
}

export const CatchBoundary = ClerkCatchBoundary(AppCatchBoundary);
