import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { authorizationLoader, isActionAllowed } from "src/helpers/remix.rbac";
import PricingPolicyForm from "~/components/forms/PricingPolicyForm";
import { createPricingPolicy } from "~/models/pricingPolicy.server";
import { PricingPolicyModelForm } from "~/models/validators/pricingPolicy.validator";

const validator = withZod(PricingPolicyModelForm);

export const action: ActionFunction = async ({ request }) => {
  await isActionAllowed(request, ["Update", "All"], ["User", "All"]);

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const pricingPolicy = await createPricingPolicy({
    data: {
      ...result.data,
    },
  });

  return redirect(`app/manage/sales/prices/${pricingPolicy.id}`);
};

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Create", "All"],
    objects: ["PricingPolicy", "All"],
    loader: async ({ request }) => {
      return {};
    },
  });
};

export default function CreatePricingPolicyPage() {
  return (
    <>
      <PricingPolicyForm />
    </>
  );
}
