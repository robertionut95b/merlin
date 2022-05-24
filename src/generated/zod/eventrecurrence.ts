import * as z from "zod"
import { DayOfWeek } from "@prisma/client"
import { CompleteScreenEvent, RelatedScreenEventModel } from "./index"

export const EventRecurrenceModel = z.object({
  id: z.string().uuid().optional(),
  groupId: z.string(),
  daysOfWeek: z.nativeEnum(DayOfWeek).array(),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  startRecur: z.date(),
  endRecur: z.date(),
  screenEventId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEventRecurrence extends z.infer<typeof EventRecurrenceModel> {
  ScreenEvent: CompleteScreenEvent
}

/**
 * RelatedEventRecurrenceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEventRecurrenceModel: z.ZodSchema<CompleteEventRecurrence> = z.lazy(() => EventRecurrenceModel.extend({
  ScreenEvent: RelatedScreenEventModel,
}))
