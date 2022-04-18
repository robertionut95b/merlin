import { getAuth, rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction, Outlet, redirect } from "remix";
import NavigationBar from "~/components/navigation/NavigationBar";
import MinimalFooter from "../components/footer/MinimalFooter";

export default function Index() {
  return (
    <main className="flex h-screen flex-col justify-between bg-gray-200">
      <div className="nav">
        <NavigationBar />
      </div>
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
