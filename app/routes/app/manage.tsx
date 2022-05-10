import { ObjectType } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getClerkUser } from "src/helpers/clerk";
import { menuOptions } from "~/components/menu/Items";
import SideBar from "~/components/menu/Sidebar";
import PageBreadcrumbs from "~/components/navigation/PageBreadcrumbs";
import { _getAccessibleResources } from "~/models/permission-validate.server";

const ManagementPage = (): JSX.Element => {
  const { opts } = useLoaderData<{
    opts: string[];
  }>();

  const menuOp = menuOptions.filter(
    (op) => opts.includes(op.resource) || opts.includes(ObjectType.All)
  );

  return (
    <>
      <div className="management flex h-full flex-col md:flex-row">
        <div className="left-side-menu gap-y-2 bg-white p-2">
          <SideBar options={menuOp} />
        </div>
        <div className="right-side-content w-full overflow-x-auto border-l border-l-gray-200 bg-white px-4 pb-2">
          <div className="page-breadcrumbs my-6">
            <PageBreadcrumbs />
          </div>
          <div className="content px-2">
            <div className="header mb-2">
              <h2 className="text-2xl font-bold">Manage</h2>
            </div>
            <div className="content flex flex-col gap-y-6">
              <p>
                This section allow users to manage the entity's main assets,
                such as locations and their configuration, user groups, roles
                and their designated permissions. This section is only available
                to users with the "manage" permission. If you are not a manager,
                you will not be able to access this section. If you are a
                manager, you will be able to manage the entity's assets.
              </p>
              <div className="mb-4 md:mb-0">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getClerkUser({ request });
  const { role } = user.private_metadata;

  if (!role) {
    return redirect("/app");
  }

  const perm = await _getAccessibleResources(["Read", "All"], role);

  if (!perm || !perm.length) {
    return redirect("/app");
  }

  return json({
    opts: perm,
  });
};

export default ManagementPage;
