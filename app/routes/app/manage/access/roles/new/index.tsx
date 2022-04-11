import { Button, MultiSelect, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { User } from "@prisma/client";
import { CatchValue } from "@remix-run/react/transition";
import { useEffect } from "react";
import {
  ActionFunction,
  ErrorBoundaryComponent,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { RelatedRoleModel } from "src/generated/zod";
import { z } from "zod";
import InputAlert from "~/components/layout/InputAlert";
import { getUsers } from "~/models/user.server";
import { validateCreateRole } from "../../../../../../models/role.server";

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const formData = await request.formData();
  // @ts-expect-error("type error")
  const values: {
    name: string;
    description: string;
  } = Object.fromEntries(formData);

  // @ts-expect-error("type error")
  const { success, error } = validateCreateRole(values);

  const issues = error.format();

  if (success === false) {
    return json({ errors: issues });
  }

  return redirect("app/manage/access/roles");
};

export const loader: LoaderFunction = async () => {
  const users = await getUsers();
  return json({
    users,
  });
};

const NewRolePage = (): JSX.Element => {
  const transition = useTransition();
  const actionData = useActionData();
  const { users } = useLoaderData<{
    users: User[];
  }>();

  const selectUsers = users.map((u) => ({ value: u.id, label: u.email }));

  const form = useForm({
    schema: zodResolver(RelatedRoleModel),
    initialValues: {
      name: "",
      description: "",
      users: [],
      permissions: [],
    },
  });

  useEffect(() => {
    if (actionData?.errors) {
      form.setErrors({
        name: actionData?.errors?.name?._errors?.[0],
        description: actionData?.errors?.description?._errors?.[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <div className="new-role">
      <div className="heading">
        <h3 className="mb-2 text-xl font-bold">New Role</h3>
      </div>
      <div className="sub-heading mb-2">
        <p>Create a new role which will enclose multiple users</p>
      </div>
      <Form method={"post"} className="flex flex-col gap-y-4">
        <TextInput
          required
          name={"name"}
          label="Name"
          {...form.getInputProps("name")}
        />
        <TextInput
          required
          name={"description"}
          label="Description"
          {...form.getInputProps("description")}
        />
        <div>
          <MultiSelect
            label="Users"
            data={selectUsers}
            searchable
            clearable
            name="users"
            {...form.getInputProps("users")}
          />
          <p className="mt-1 text-sm italic">
            You can add the users later as well
          </p>
        </div>
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default NewRolePage;
