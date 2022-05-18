import * as z from "zod"
import { SettingsCategory } from "@prisma/client"

export const ApplicationSettingsModel = z.object({
  id: z.string(),
  category: z.nativeEnum(SettingsCategory),
  key: z.string(),
  value: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
