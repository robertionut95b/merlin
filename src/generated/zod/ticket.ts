import * as z from "zod"
import { CompleteSeat, RelatedSeatModel, CompleteUser, RelatedUserModel, CompleteScreenEvent, RelatedScreenEventModel } from "./index"

export const TicketModel = z.object({
  id: z.string().optional(),
  userId: z.string().nonempty(),
  screenEventId: z.string(),
  time: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteTicket extends z.infer<typeof TicketModel> {
  seats: CompleteSeat[]
  user: CompleteUser
  ScreenEvent: CompleteScreenEvent
}

/**
 * RelatedTicketModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketModel: z.ZodSchema<CompleteTicket> = z.lazy(() => TicketModel.extend({
  seats: RelatedSeatModel.array().min(1, { message: "Must have at least one seat" }),
  user: RelatedUserModel,
  ScreenEvent: RelatedScreenEventModel,
}))
