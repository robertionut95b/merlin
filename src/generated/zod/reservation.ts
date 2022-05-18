import * as z from "zod"
import { CompleteSeat, RelatedSeatModel, CompleteTheatre, RelatedTheatreModel, CompleteScreenSchedule, RelatedScreenScheduleModel, CompleteUser, RelatedUserModel } from "./index"

export const ReservationModel = z.object({
  id: z.string().uuid().optional(),
  theatreId: z.string(),
  screenScheduleId: z.string(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteReservation extends z.infer<typeof ReservationModel> {
  seats: CompleteSeat[]
  theatre: CompleteTheatre
  screenSchedule: CompleteScreenSchedule
  user: CompleteUser
}

/**
 * RelatedReservationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedReservationModel: z.ZodSchema<CompleteReservation> = z.lazy(() => ReservationModel.extend({
  seats: RelatedSeatModel.array().min(1, { message: "Must have at least one seat" }),
  theatre: RelatedTheatreModel.min(1, { message: "Must have at least one theatre" }),
  screenSchedule: RelatedScreenScheduleModel.min(1, { message: "Must have at least one screening" }),
  user: RelatedUserModel.min(1, { message: "Must have at least one user" }),
}))
