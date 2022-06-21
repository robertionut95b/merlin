import { PricingPolicyModel } from "src/generated/zod";
import { z } from "zod";

export const PricingPolicyModelForm = PricingPolicyModel.extend({
  price: z.string().transform((v) => parseFloat(v)),
});
