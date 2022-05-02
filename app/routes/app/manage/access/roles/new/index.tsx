import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { RoleModel } from "src/generated/zod";
import InputAlert from "~/components/layout/InputAlert";
import { getUsers } from "~/models/user.server";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import { validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { showNotification } from "@mantine/notifications";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { createRole } from "~/models/role.server";
import RoleForm from "../../../../../../components/forms/RoleForm";

const UsersRoleModel = RoleModel.extend({
  users: z.array(z.string()),
});

const validator = withZod(zfd.formData(UsersRoleModel));

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const { name, description, users } = result.data;

  try {
    await createRole({
      data: {
        name,
        description,
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

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const users = await getUsers();
  return json({
    users,
  });
};

const NewRolePage = (): JSX.Element => {
  const { users } = useLoaderData<{
    users: User[];
  }>();

  const selectUsers = users.map((u) => ({
    value: u.id,
    label: u.email,
  }));

  return (
    <div className="new-role">
      <RoleForm selectUsers={selectUsers} />
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

  return <NewRolePage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default NewRolePage;
