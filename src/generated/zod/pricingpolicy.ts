import * as z from "zod"
import { AgeCategory } from "@prisma/client"
import { CompleteScreenSchedule, RelatedScreenScheduleModel } from "./index"

export const PricingPolicyModel = z.object({
  id: z.string().uuid().optional(),
  ageCategory: z.nativeEnum(AgeCategory),
  price: z.number(),
  screenScheduleId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompletePricingPolicy extends z.infer<typeof PricingPolicyModel> {
  ScreenSchedule?: CompleteScreenSchedule | null
}

/**
 * RelatedPricingPolicyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPricingPolicyModel: z.ZodSchema<CompletePricingPolicy> = z.lazy(() => PricingPolicyModel.extend({
  ScreenSchedule: RelatedScreenScheduleModel.nullish(),
}))
