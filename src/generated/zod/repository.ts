import * as z from "zod"
import { RepositoryStatus } from "@prisma/client"

export const RepositoryModel = z.object({
  id: z.string(),
  version: z.number(),
  status: z.nativeEnum(RepositoryStatus),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
