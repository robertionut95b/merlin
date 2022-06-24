import { ScreeningModel } from "src/generated/zod";
import { z } from "zod";

export const ScreeningModelForm = ScreeningModel.extend({
  duration: z
    .string()
    .nonempty()
    .transform((value) => Number.parseInt(value, 10)),
  release: z
    .string()
    .nonempty({ message: "Release must not be empty" })
    .transform((v) => new Date(v)),
});
