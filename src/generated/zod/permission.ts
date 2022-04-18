import * as z from "zod"
import { ObjectType, ActionType } from "@prisma/client"
import { CompleteRole, RelatedRoleModel } from "./index"

export const PermissionModel = z.object({
  id: z.string().uuid().optional(),
  objectType: z.nativeEnum(ObjectType),
  action: z.nativeEnum(ActionType).array().min(1, { message: "Must have at least one action type" }).or(z.string()),
  allowed: z.boolean(),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePermission extends z.infer<typeof PermissionModel> {
  Role: CompleteRole
}

/**
 * RelatedPermissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPermissionModel: z.ZodSchema<CompletePermission> = z.lazy(() => PermissionModel.extend({
  Role: RelatedRoleModel,
}))
