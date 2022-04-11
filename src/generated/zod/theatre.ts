import * as z from "zod"
import { CompleteLocation, RelatedLocationModel, CompleteSpot, RelatedSpotModel } from "./index"

export const TheatreModel = z.object({
  id: z.string(),
  name: z.string(),
  locationId: z.string(),
  capacity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTheatre extends z.infer<typeof TheatreModel> {
  location: CompleteLocation
  spots: CompleteSpot[]
}

/**
 * RelatedTheatreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTheatreModel: z.ZodSchema<CompleteTheatre> = z.lazy(() => TheatreModel.extend({
  location: RelatedLocationModel,
  spots: RelatedSpotModel.array(),
}))
