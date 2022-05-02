import type { Role, User } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { RoleModel } from "src/generated/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import MultiSelectInput from "../validated-form/MultiSelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const UsersRoleModel = RoleModel.extend({
  users: z.array(z.string()),
});

const validator = withZod(zfd.formData(UsersRoleModel));

interface ISelectUsersProps {
  selectUsers: { value: string; label: string }[];
  role?: Role & {
    users: User[];
  };
  readOnly?: boolean;
}

const RoleForm = ({
  selectUsers,
  role,
  readOnly = false,
}: ISelectUsersProps): JSX.Element => {
  return (
    <>
      <div className="new-role">
        <div className="heading">
          <h3 className="mb-2 text-xl font-bold">New Role</h3>
        </div>
        <div className="sub-heading mb-2">
          <p>Create a new role which will enclose multiple users</p>
        </div>
        <ValidatedForm
          aria-readonly={readOnly}
          method={"post"}
          className="flex flex-col gap-y-4"
          validator={validator}
          defaultValues={{
            name: role?.name || "",
            description: role?.description || "",
            users: role?.users.map((u) => u.id) || [],
            createdAt: role?.createdAt || new Date(),
            updatedAt: role?.updatedAt || new Date(),
          }}
        >
          <TextInput required name={"name"} label="Name" readOnly={readOnly} />
          <TextInput
            required
            name={"description"}
            label="Description"
            readOnly={readOnly}
          />
          <MultiSelectInput
            label="Users"
            data={selectUsers}
            searchable
            clearable
            name="users"
            disabled={readOnly}
            helper={
              <span className="text-xs">
                You can add the users later as well
              </span>
            }
          />
          <DateTimeInput
            disabled
            label="Created"
            type="date"
            name="createdAt"
          />
          <DateTimeInput
            disabled
            label="Updated"
            type="date"
            name="updatedAt"
          />
          {!readOnly && (
            <SubmitButton
              className={"place-self-start"}
              type={"submit"}
              variant="outline"
              color="indigo"
            />
          )}
        </ValidatedForm>
      </div>
    </>
  );
};

export default RoleForm;
