import { showNotification } from "@mantine/notifications";
import type { Role, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { RoleModel } from "src/generated/zod";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import { z } from "zod";
import { zfd } from "zod-form-data";
import RoleForm from "~/components/forms/RoleForm";
import InputAlert from "~/components/layout/InputAlert";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { updateRole, getUniqueRole } from "~/models/role.server";
import { getUsers } from "~/models/user.server";

const UsersRoleModel = RoleModel.extend({
  users: z.array(z.string()),
});

const validator = withZod(zfd.formData(UsersRoleModel));

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<any> => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Update", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const { name, description, users } = result.data;

  try {
    // TO-DO
    await updateRole({
      where: { id: params.roleId },
      data: {
        name: {
          set: name,
        },
        description: {
          set: description,
        },
        users: {
          connect: users.map((user) => ({ id: user })),
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e?.code === "P2002") {
        throw new Response("Role already exists", { status: 400 });
      }
    }
    throw e;
  }

  return redirect("app/manage/access/roles");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Update", "All"],
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
      <RoleForm role={role} selectUsers={selectUsers} />
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
