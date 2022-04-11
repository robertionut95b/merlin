import * as z from "zod"
import { CompleteAddress, RelatedAddressModel, CompleteTheatre, RelatedTheatreModel } from "./index"

export const LocationModel = z.object({
  id: z.string(),
  name: z.string(),
  addressId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteLocation extends z.infer<typeof LocationModel> {
  address: CompleteAddress
  theatres: CompleteTheatre[]
}

/**
 * RelatedLocationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLocationModel: z.ZodSchema<CompleteLocation> = z.lazy(() => LocationModel.extend({
  address: RelatedAddressModel,
  theatres: RelatedTheatreModel.array(),
}))
