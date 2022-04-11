import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompletePermission, RelatedPermissionModel } from "./index"

export const RoleModel = z.object({
  id: z.string(),
  name: z.string().min(8, { message: "Role name must have at least 8 characters" }),
  description: z.string().min(10, { message: "Role description must have at least 10 characters" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteRole extends z.infer<typeof RoleModel> {
  users: CompleteUser[]
  permissions: CompletePermission[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  users: RelatedUserModel.array(),
  permissions: RelatedPermissionModel.array(),
}))
