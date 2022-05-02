import { showNotification } from "@mantine/notifications";
import type { Role, User } from "@prisma/client";
import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import RoleForm from "~/components/forms/RoleForm";
import InputAlert from "~/components/layout/InputAlert";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { getUniqueRole } from "~/models/role.server";
import { getUsers } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const users = await getUsers();
  const role = await getUniqueRole({
    where: {
      id: params.roleId,
    },
    include: {
      users: true,
    },
  });
  return json({
    users,
    role,
  });
};

const EditRolePage = (): JSX.Element => {
  const { users, role } = useLoaderData<{
    users: User[];
    role: Role & {
      users: User[];
    };
  }>();

  const selectUsers = users.map((u) => ({
    value: u.id,
    label: u.email,
  }));

  return (
    <div className="new-role">
      <RoleForm readOnly role={role} selectUsers={selectUsers} />
    </div>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 400) {
    showNotification({
      title: "Invalid input",
      message: caught.data,
      autoClose: 3000,
      color: "red",
      icon: <AlertCircle size={16} />,
    });
  }

  return <EditRolePage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default EditRolePage;
