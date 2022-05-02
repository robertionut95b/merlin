import { Button, Checkbox, MultiSelect, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Role } from "@prisma/client";
import { ActionType, ObjectType, Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useCatch,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { PermissionModel } from "src/generated/zod";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import {
  createManyPermissions,
  validateCreatePermissions,
  validateHigherPermission,
} from "~/models/permission.server";
import { getRoles } from "~/models/role.server";
import type { FormEvent } from "react";
import { showNotification } from "@mantine/notifications";

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Permission", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  // @ts-expect-error("type error")
  const values: {
    objectType: ObjectType;
    action: ActionType[];
    roleId: string;
    allowed: string;
    createdAt: string;
    updatedAt: string;
  } = Object.fromEntries(formData);

  const actions = values.action.toString().split(",");
  const prismaInput = actions.map((ac) => ({
    action: ActionType[ac as keyof typeof ActionType],
    allowed: values.allowed === "true",
    objectType: ObjectType[values.objectType as keyof typeof ObjectType],
    roleId: values.roleId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const perms = validateCreatePermissions({ data: prismaInput });
  // @ts-expect-error("type error")
  if (!perms.reduce((acc, curr) => acc.success || curr.success, false)) {
    throw new Response("Invalid data", { status: 400 });
  }

  const higherPerm = await validateHigherPermission(
    values.roleId,
    values.objectType
  );
  if (higherPerm) {
    throw new Response("Higher level permission already exists", {
      status: 400,
    });
  }

  try {
    await createManyPermissions({
      data: prismaInput,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e?.code === "P2002") {
        throw new Response("Permission already exists", { status: 400 });
      }
    }
    throw e;
  }

  return redirect("app/manage/access/permissions");
};

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Permission", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const roles = await getRoles();
  const objectTypes: string[] = Object.keys(ObjectType);
  const actionTypes: string[] = Object.keys(ActionType);
  return json({
    roles,
    objectTypes,
    actionTypes,
  });
};

const PermissionsNewPage = (): JSX.Element => {
  const { roles, objectTypes, actionTypes } = useLoaderData<{
    roles: Role[];
    objectTypes: string[];
    actionTypes: string[];
  }>();
  const selectRoles = roles.map((r) => ({ value: r.id, label: r.name }));
  const selectObjectTypes = objectTypes.map((ot) => ({ value: ot, label: ot }));
  const selectActionTypes = actionTypes.map((at) => ({ value: at, label: at }));

  const transition = useTransition();
  const submit = useSubmit();

  const form = useForm({
    schema: zodResolver(PermissionModel),
    initialValues: {
      objectType: "",
      action: [],
      allowed: true,
      roleId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const handleSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.validate();

    if (Object.keys(form.errors).length > 0) {
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("roleId", form.values.roleId);
    formData.set("action", form.values.action.join(","));

    submit(formData, { replace: true, method: "post" });
  };

  return (
    <div className="new-perm">
      <div className="heading">
        <h3 className="mb-2 text-xl font-bold">New permission</h3>
      </div>
      <div className="sub-heading mb-2">
        <p>Create a new permission rule</p>
      </div>
      <Form
        method={"post"}
        className="flex flex-col gap-y-4"
        onSubmit={(e) => {
          handleSubmitHandler(e);
        }}
      >
        <Select
          required
          name="roleId"
          data={selectRoles}
          label="Role"
          placeholder="Admin"
          {...form.getInputProps("roleId")}
        />
        <Select
          required
          name="objectType"
          data={selectObjectTypes}
          label="Object"
          placeholder="Locations"
          {...form.getInputProps("objectType")}
        />
        <MultiSelect
          required
          name="action"
          data={selectActionTypes}
          label="Action"
          placeholder="Read"
          {...form.getInputProps("action")}
        />
        <Checkbox
          placeholder="Allowed"
          label="Allowed"
          color={"violet"}
          name="allowed"
          {...form.getInputProps("allowed")}
        />
        <input
          hidden
          type="date"
          name="createdAt"
          {...form.getInputProps("createdAt")}
        />
        <input
          hidden
          type="date"
          name="updatedAt"
          {...form.getInputProps("updatedAt")}
        />
        <Button
          className={"place-self-start"}
          type={"submit"}
          variant="outline"
          color="violet"
          loading={transition.state === "submitting"}
        >
          Submit
        </Button>
      </Form>
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
    });
  }

  return <PermissionsNewPage />;
}

export function ErrorBoundary(): JSX.Element {
  return (
    <DataAlert message="There is something wrong on our end ... We are working on it!" />
  );
}

export default PermissionsNewPage;
