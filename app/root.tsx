import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { LinksFunction, MetaFunction, LoaderFunction } from "remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import globals from "./styles/globals.css";
import NotFoundPage from "./components/navigation/NotFound";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: globals },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Merlin App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      // const { userId } = request.auth;
      // fetch data
      return { yourData: "here" };
    },
    { loadUser: true }
  );
};

const App = (): JSX.Element => {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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
