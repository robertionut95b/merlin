import type { ActionType, ObjectType } from "@prisma/client";
import type {
  AppData,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { _validate } from "~/models/permission-validate.server";
import { authenticator } from "~/services/auth/auth.server";
interface AuthMiddleware {
  actions: ActionType | ActionType[];
  objects: ObjectType | ObjectType[];
  loader: LoaderFunction;
  redirectTo?: string;
}

export interface AccessLoaderFunction {
  (args: DataFunctionArgs & AuthMiddleware):
    | Promise<Response>
    | Response
    | Promise<AppData>
    | AppData;
}

export async function IsAllowedAccess({
  request,
  actions,
  objects,
}: {
  request: Request;
  actions: ActionType | ActionType[];
  objects: ObjectType | ObjectType[];
}): Promise<boolean | Response> {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const role = user?.role?.name;

  if (role === null || role === undefined) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return _validate(actions, objects, role);
}

export const authorizationLoader: AccessLoaderFunction = async (args) => {
  const { request, actions, objects, redirectTo, loader } = args;

  const access = await IsAllowedAccess({
    request,
    actions,
    objects,
  });

  if (access === false) {
    if (!redirectTo) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return redirect(redirectTo);
  }

  return loader(args);
};
