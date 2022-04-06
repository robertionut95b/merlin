import { Outlet } from "remix";
import { menuOptions } from "~/components/menu/Items";
import ManagementMenu from "../../components/menu/ManagementMenu";
import PageBreadcrumbs from "../../components/navigation/PageBreadcrumbs";

const ManagementPage = (): JSX.Element => {
  return (
    <>
      <div className="management flex h-full flex-col gap-y-6 md:flex-row">
        <div className="left-side-menu min-w-full gap-y-2 overflow-auto bg-white p-2 md:min-w-[14rem] md:resize-x">
          <ManagementMenu options={menuOptions} />
        </div>
        <div className="right-side-content w-full border-l border-l-gray-200 bg-white px-4 pb-2">
          <div className="page-breadcrumbs my-6">
            <PageBreadcrumbs />
          </div>
          <div className="header mb-2">
            <h2 className="text-2xl font-bold">Manage</h2>
          </div>
          <div className="content flex flex-col gap-y-6">
            <p>
              This section allow users to manage the entity's main assets, such
              as locations and their configuration, user groups, roles and their
              designated permissions. This section is only available to users
              with the "manage" permission. If you are not a manager, you will
              not be able to access this section. If you are a manager, you will
              be able to manage the entity's assets.
            </p>
            <>
              <Outlet />
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagementPage;
