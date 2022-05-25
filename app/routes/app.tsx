import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NavigationBar from "~/components/navigation/NavigationBar";
import { authenticator } from "~/services/auth/auth.server";
import TopBanner from "../components/navigation/TopBanner";

export default function Index() {
  const { user } = useLoaderData<{ user: User }>();

  return (
    <main className="flex h-screen flex-col justify-between bg-gray-200">
      <div className="nav">
        <NavigationBar user={user} />
      </div>
      <div className="banner">
        <TopBanner
          className="flex justify-center border border-b border-gray-200"
          message="The app will undergo a scheduled maintenance during this Thursday, August 21st, 2021. We apologize for the inconvenience."
        />
      </div>
      <div className="content grow">
        <Outlet />
      </div>
    </main>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) {
    return redirect("/login");
  }

  return json({
    user,
  });
};
