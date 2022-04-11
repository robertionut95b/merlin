import * as z from "zod"
import { CompleteTheatre, RelatedTheatreModel } from "./index"

export const SpotModel = z.object({
  number: z.number().int(),
  theatreId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSpot extends z.infer<typeof SpotModel> {
  theatre: CompleteTheatre
}

/**
 * RelatedSpotModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSpotModel: z.ZodSchema<CompleteSpot> = z.lazy(() => SpotModel.extend({
  theatre: RelatedTheatreModel,
}))
