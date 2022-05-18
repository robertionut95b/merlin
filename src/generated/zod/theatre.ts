import * as z from "zod"
import { CompleteLocation, RelatedLocationModel, CompleteSeat, RelatedSeatModel, CompleteScreenSchedule, RelatedScreenScheduleModel, CompleteReservation, RelatedReservationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TheatreModel = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(5, { message: "Name must have at least 5 characters" }),
  locationId: z.string().min(1, { message: "Must have a location set" }),
  capacity: z.number().int().optional(),
  rows: z.number().int(),
  columns: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  screenScheduleId: z.string().nullish(),
})

export interface CompleteTheatre extends z.infer<typeof TheatreModel> {
  location: CompleteLocation
  seats: CompleteSeat[]
  ScreenSchedule?: CompleteScreenSchedule | null
  Reservation: CompleteReservation[]
  Ticket: CompleteTicket[]
}

/**
 * RelatedTheatreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTheatreModel: z.ZodSchema<CompleteTheatre> = z.lazy(() => TheatreModel.extend({
  location: RelatedLocationModel,
  seats: RelatedSeatModel.array().min(1, { message: "Must have at least one seat" }),
  ScreenSchedule: RelatedScreenScheduleModel.nullish(),
  Reservation: RelatedReservationModel.array(),
  Ticket: RelatedTicketModel.array(),
}))
