import * as z from "zod"
import { CompleteLocation, RelatedLocationModel } from "./index"

export const AddressModel = z.object({
  id: z.string(),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  Location?: CompleteLocation | null
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  Location: RelatedLocationModel.nullish(),
}))
