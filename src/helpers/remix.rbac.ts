import { ActionType, ObjectType } from "@prisma/client";
import { _validate } from "~/models/permission-validate.server";
import { getClerkUser } from "./clerk";

export async function IsAllowedAccess({
  request,
  actions,
  objects,
}: {
  request: Request;
  actions: ActionType | ActionType[];
  objects: ObjectType | ObjectType[];
}): Promise<boolean | Response> {
  const user = await getClerkUser({ request });
  const { role } = user.private_metadata;

  if (!role) {
    return new Response("Unauthorized", { status: 401 });
  }

  return _validate(actions, objects, role);
}
