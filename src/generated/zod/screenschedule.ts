import * as z from "zod"
import { CompleteScreening, RelatedScreeningModel, CompleteTheatre, RelatedTheatreModel, CompletePricingPolicy, RelatedPricingPolicyModel, CompleteReservation, RelatedReservationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const ScreenScheduleModel = z.object({
  id: z.string().uuid().optional(),
  startingDate: z.date(),
  endingDate: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteScreenSchedule extends z.infer<typeof ScreenScheduleModel> {
  screenings: CompleteScreening[]
  theatres: CompleteTheatre[]
  pricingPolicies: CompletePricingPolicy[]
  Reservation: CompleteReservation[]
  Ticket: CompleteTicket[]
}

/**
 * RelatedScreenScheduleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedScreenScheduleModel: z.ZodSchema<CompleteScreenSchedule> = z.lazy(() => ScreenScheduleModel.extend({
  screenings: RelatedScreeningModel.array().min(1, { message: "Must have at least one screening" }),
  theatres: RelatedTheatreModel.array().min(1, { message: "Must have at least one theatre" }),
  pricingPolicies: RelatedPricingPolicyModel.array(),
  Reservation: RelatedReservationModel.array(),
  Ticket: RelatedTicketModel.array(),
}))
