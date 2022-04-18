import { LoaderFunction, redirect } from "remix";
import { IsAllowedAccess } from "src/helpers/remix.rbac";

const AccessPage = (): JSX.Element => {
  return <>Access page</>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Permission", "User", "Role"],
  });

  if (!access) {
    return redirect("/app");
  }

  return {};
};

export default AccessPage;
