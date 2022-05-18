import * as z from "zod"
import { CompleteRole, RelatedRoleModel, CompleteReservation, RelatedReservationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const UserModel = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  username: z.string(),
  roleId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  role: CompleteRole
  Reservation: CompleteReservation[]
  Ticket: CompleteTicket[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  role: RelatedRoleModel,
  Reservation: RelatedReservationModel.array(),
  Ticket: RelatedTicketModel.array(),
}))
