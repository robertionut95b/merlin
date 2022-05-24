import * as z from "zod"
import { DayOfWeek } from "@prisma/client"
import { CompleteTheatre, RelatedTheatreModel, CompleteScreening, RelatedScreeningModel, CompletePricingPolicy, RelatedPricingPolicyModel, CompleteTicket, RelatedTicketModel } from "./index"

export const ScreenEventModel = z.object({
  id: z.string(),
  daysOfWeek: z.nativeEnum(DayOfWeek).array(),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  startRecur: z.date(),
  endRecur: z.date(),
  screeningId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteScreenEvent extends z.infer<typeof ScreenEventModel> {
  theatres: CompleteTheatre[]
  screening: CompleteScreening
  pricingPolicy: CompletePricingPolicy[]
  tickets: CompleteTicket[]
}

/**
 * RelatedScreenEventModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedScreenEventModel: z.ZodSchema<CompleteScreenEvent> = z.lazy(() => ScreenEventModel.extend({
  theatres: RelatedTheatreModel.array().min(1, { message: "Must have at least one theatre" }),
  screening: RelatedScreeningModel,
  pricingPolicy: RelatedPricingPolicyModel.array(),
  tickets: RelatedTicketModel.array(),
}))
