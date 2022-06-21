import { ScreeningModel } from "src/generated/zod";
import { z } from "zod";

export const ScreeningModelForm = ScreeningModel.extend({
  duration: z.string().transform((value) => Number.parseInt(value, 10)),
  release: z.string().transform((v) => new Date(v)),
});
