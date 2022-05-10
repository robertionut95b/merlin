import * as z from "zod"
import { CompleteLocation, RelatedLocationModel, CompleteSeat, RelatedSeatModel } from "./index"

export const TheatreModel = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(5, { message: "Name must have at least 5 characters" }),
  locationId: z.string(),
  capacity: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteTheatre extends z.infer<typeof TheatreModel> {
  location: CompleteLocation
  spots: CompleteSeat[]
}

/**
 * RelatedTheatreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTheatreModel: z.ZodSchema<CompleteTheatre> = z.lazy(() => TheatreModel.extend({
  location: RelatedLocationModel,
  spots: RelatedSeatModel.array(),
}))
