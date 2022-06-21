import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { Permission } from "@prisma/client";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import {
  AuthenticityTokenProvider,
  createAuthenticityToken,
} from "remix-utils";
import AccessUnauthorizedPage from "./components/navigation/AccessUnauthorized";
import NotFoundPage from "./components/navigation/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import { getPermissions } from "./models/permission.server";
import { getUserById } from "./models/user.server";
import type { UserWithRole } from "./services/auth/auth.server";
import { authenticator } from "./services/auth/auth.server";
import { commitSession, getSession } from "./session.server";
import fullCalendarStylesheetUrl from "./styles/main.min.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl, as: "style" },
    {
      rel: "stylesheet",
      href: fullCalendarStylesheetUrl,
      as: "style",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Merlin App",
  viewport: "width=device-width,initial-scale=1",
});

interface LoaderProps {
  permissions: Permission[];
  user: UserWithRole;
  csrf: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  var permissions: Permission[] = [];
  let session = await getSession(request.headers.get("cookie"));
  const csrf = createAuthenticityToken(session);

  if (user !== null && user !== undefined) {
    const userEntry = await getUserById(user.id);
    permissions = await getPermissions({
      where: { roleId: userEntry?.roleId || undefined },
    });
  }

  return json(
    {
      permissions,
      user,
      csrf,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

const App = (): JSX.Element => {
  const { user, permissions, csrf } = useLoaderData<LoaderProps>();
  return (
    <html lang="en" className="h-full font-inter">
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
              <AuthenticityTokenProvider token={csrf}>
                <AuthProvider user={user} permissions={permissions}>
                  <Outlet />
                </AuthProvider>
              </AuthenticityTokenProvider>
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

export default App;

export const CatchBoundary = () => {
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
};
