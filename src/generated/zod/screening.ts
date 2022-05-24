import * as z from "zod"
import { CompleteScreenEvent, RelatedScreenEventModel } from "./index"

export const ScreeningModel = z.object({
  imdbId: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  poster: z.string(),
  rating: z.string(),
  duration: z.number().int(),
  release: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteScreening extends z.infer<typeof ScreeningModel> {
  ScreenEvent: CompleteScreenEvent[]
}

/**
 * RelatedScreeningModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedScreeningModel: z.ZodSchema<CompleteScreening> = z.lazy(() => ScreeningModel.extend({
  ScreenEvent: RelatedScreenEventModel.array(),
}))
