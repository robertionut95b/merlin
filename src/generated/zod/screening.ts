import * as z from "zod"
import { CompleteScreenEvent, RelatedScreenEventModel } from "./index"

export const ScreeningModel = z.object({
  imdbId: z.string().nonempty().regex(/(tt)\d{7,9}/, { message: "Invalid IMDB id format" }),
  title: z.string().nonempty().min(1),
  description: z.string().nonempty().min(20),
  poster: z.string().nonempty().min(10),
  rating: z.string().nonempty().min(1),
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
