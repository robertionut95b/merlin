import * as z from "zod"
import { AgeCategory, TicketType } from "@prisma/client"
import { CompleteScreenEvent, RelatedScreenEventModel } from "./index"

export const PricingPolicyModel = z.object({
  id: z.string().optional(),
  ageCategory: z.nativeEnum(AgeCategory),
  ticketType: z.nativeEnum(TicketType),
  price: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompletePricingPolicy extends z.infer<typeof PricingPolicyModel> {
  ScreenEvent: CompleteScreenEvent[]
}

/**
 * RelatedPricingPolicyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPricingPolicyModel: z.ZodSchema<CompletePricingPolicy> = z.lazy(() => PricingPolicyModel.extend({
  ScreenEvent: RelatedScreenEventModel.array(),
}))
