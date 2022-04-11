import { Button, Checkbox, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionType, ObjectType, Role } from "@prisma/client";
import { useEffect } from "react";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { RelatedPermissionModel } from "src/generated/zod";
import { isAdding } from "src/helpers/remix";
import DataAlert from "~/components/layout/DataAlert";
import { createPermission } from "~/models/permission.server";
import { getRoles } from "~/models/role.server";
import { validateCreatePermission } from "../../../../../../models/permission.server";

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const formData = await request.formData();
  // @ts-expect-error("type error")
  const values: {
    objectType: ObjectType;
    action: ActionType;
    role: string;
    allowed: string;
  } = Object.fromEntries(formData);

  const sanitizedValues = { ...values, allow: values.allowed === "true" };

  // @ts-expect-error("type error")
  const { success, error } = validateCreatePermission(sanitizedValues);
  const issues = error.format();

  if (success === false) {
    return json({ errors: issues });
  }

  const perm = await createPermission({
    data: {
      action: values.action,
      allowed: values.allowed === "true",
      objectType: values.objectType,
      Role: {
        connect: {
          name: values.role,
        },
      },
    },
  });

  if (!perm) {
    return json({ errors: {} });
  }

  return redirect("app/manage/access/permissions");
};

export const loader: LoaderFunction = async () => {
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
  const actionData = useActionData();

  const form = useForm({
    schema: zodResolver(RelatedPermissionModel),
    initialValues: {
      objectType: "",
      action: "",
      allowed: false,
      role: "",
    },
  });

  useEffect(() => {
    // const create = isAdding(transition);
    // if (!create) {
    //   form.reset();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transition]);

  useEffect(() => {
    if (actionData?.errors) {
      form.setErrors({
        action: actionData?.errors?.action?._errors?.[0],
        objectType: actionData?.errors?.objectType?._errors?.[0],
        role: actionData?.errors?.roleId?._errors?.[0],
        allowed: actionData?.errors?.allowed?._errors?.[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <div className="new-perm">
      <div className="heading">
        <h3 className="mb-2 text-xl font-bold">New permission</h3>
      </div>
      <div className="sub-heading mb-2">
        <p>Create a new permission rule</p>
      </div>
      <Form method={"post"} className="flex flex-col gap-y-4">
        <Select
          required
          name="objectType"
          data={selectObjectTypes}
          label="Object"
          placeholder="Locations"
          {...form.getInputProps("objectType")}
        />
        <Select
          required
          name="role"
          data={selectRoles}
          label="Role"
          placeholder="Admin"
          {...form.getInputProps("role")}
        />
        <Select
          required
          name="action"
          data={selectActionTypes}
          label="Action"
          placeholder="Read"
          {...form.getInputProps("action")}
        />
        <Checkbox
          required
          placeholder="Allowed"
          label="Allowed"
          color={"violet"}
          name="allowed"
          {...form.getInputProps("allowed")}
        />
        <Button
          className={"place-self-start"}
          type={"submit"}
          variant="white"
          color="violet"
          loading={transition.state === "submitting"}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Invalid data input" />;
}

export default PermissionsNewPage;
