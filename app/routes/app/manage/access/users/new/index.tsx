import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { UserModel } from "src/generated/zod";
import { TextInput } from "~/components/validated-form/TextInput";
import { SubmitButton } from "~/components/validated-form/SubmitButton";
import { useCatch, useLoaderData } from "@remix-run/react";
import SelectInput from "~/components/validated-form/SelectInput";
import type { Role } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { getRoles } from "~/models/role.server";
import { DateTimeInput } from "~/components/validated-form/DateTimeInput";
import { createUser } from "~/models/user.server";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import InputAlert from "~/components/layout/InputAlert";
import { showNotification } from "@mantine/notifications";
import { AlertCircle } from "~/components/react-icons/AlertCircle";

const validator = withZod(UserModel);

interface LoaderData {
  roles: Role[];
}

export const action: ActionFunction = async ({ request }) => {
  const access = IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["User", "All"],
  });

  if (!access) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const { email, username, roleId } = result.data;
  try {
    await createUser({
      data: {
        email,
        username,
        roleId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e?.code === "P2002") {
        throw new Response("User already exists", { status: 400 });
      }
    }
    throw e;
  }

  return redirect(`/app/manage/access/users`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const access = IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["User", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const roles = await getRoles();
  return json({ roles });
};

const NewUserPage = (): JSX.Element => {
  const { roles } = useLoaderData<LoaderData>();

  return (
    <div className="new-user">
      <div className="heading">
        <h3 className="mb-2 text-xl font-bold">New User</h3>
      </div>
      <div className="sub-heading mb-2">
        <p>Create a new user which will have access in the application</p>
      </div>
      <ValidatedForm
        id={"new-user-form"}
        validator={validator}
        method="post"
        className="flex flex-col gap-y-4"
        defaultValues={{
          email: "",
          username: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      >
        <TextInput name="email" label="Email" type="email" required />
        <TextInput name="username" label="Username" required />
        <SelectInput
          name="roleId"
          label="Role"
          required
          data={roles.map((r) => ({ value: r.id, label: r.name }))}
        />
        <DateTimeInput name="createdAt" label="Created" disabled type="date" />
        <DateTimeInput name="updatedAt" label="Updated" type="date" disabled />
        <SubmitButton className={"place-self-start"} variant="outline" />
      </ValidatedForm>
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

  return <NewUserPage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default NewUserPage;
