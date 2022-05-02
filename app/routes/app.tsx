import { getAuth, rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import NavigationBar from "~/components/navigation/NavigationBar";
import TopBanner from "../components/navigation/TopBanner";

export default function Index() {
  return (
    <main className="flex h-screen flex-col justify-between bg-gray-200">
      <div className="nav">
        <NavigationBar />
      </div>
      <TopBanner
        className="flex min-h-[3rem] justify-center border border-b border-gray-200"
        message="The app will undergo a scheduled maintenance during this Thursday, August 21st, 2021. We apologize for the inconvenience."
      />
      <div className="content grow">
        <Outlet />
      </div>
      {/* <MinimalFooter /> */}
    </main>
  );
}

export const loader: LoaderFunction = async (args) => {
  const { request } = args;
  const { userId } = await getAuth(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  return rootAuthLoader(args, { loadUser: true });
};
