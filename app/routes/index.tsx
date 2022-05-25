import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

const IndexPage = (): JSX.Element => {
  return <></>;
};

export const loader: LoaderFunction = async () => {
  return redirect("/app");
};

export default IndexPage;
