import { getAuth, rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";

const IndexPage = (): null => {
  return null;
};

export const loader: LoaderFunction = async (args) => {
  const { request } = args;
  const { userId } = await getAuth(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  if (userId) {
    return redirect("/app");
  }

  return rootAuthLoader(args, { loadUser: true });
};

export default IndexPage;
