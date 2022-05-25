import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const PasswordModel = z.object({
  id: z.string().uuid().optional(),
  password: z.string(),
  userId: z.string(),
  active: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompletePassword extends z.infer<typeof PasswordModel> {
  User: CompleteUser
}

/**
 * RelatedPasswordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPasswordModel: z.ZodSchema<CompletePassword> = z.lazy(() => PasswordModel.extend({
  User: RelatedUserModel,
}))
