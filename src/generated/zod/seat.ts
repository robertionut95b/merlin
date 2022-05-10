import * as z from "zod"
import { CompleteTheatre, RelatedTheatreModel } from "./index"

export const SeatModel = z.object({
  row: z.number().int(),
  column: z.number().int(),
  theatreId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteSeat extends z.infer<typeof SeatModel> {
  theatre: CompleteTheatre
}

/**
 * RelatedSeatModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSeatModel: z.ZodSchema<CompleteSeat> = z.lazy(() => SeatModel.extend({
  theatre: RelatedTheatreModel,
}))
