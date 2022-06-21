import type { PricingPolicy } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { authorizationLoader, isActionAllowed } from "src/helpers/remix.rbac";
import PricingPolicyForm from "~/components/forms/PricingPolicyForm";
import { getUniquePricingPolicy } from "~/models/pricingPolicy.server";
import { PricingPolicyModelForm } from "~/models/validators/pricingPolicy.validator";

const validator = withZod(PricingPolicyModelForm);

export const action: ActionFunction = async ({ request }) => {
  await isActionAllowed(request, ["Update", "All"], ["User", "All"]);

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  return redirect(`app/manage/sales/prices/`);
};

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Update", "All"],
    objects: ["PricingPolicy", "All"],
    loader: async ({ params }) => {
      const pricingPolicy = await getUniquePricingPolicy({
        where: {
          id: params.pricingPolicy,
        },
      });
      return {
        pricingPolicy,
      };
    },
  });
};

export default function PricingPolicyUpdatePage() {
  const { pricingPolicy } = useLoaderData<{
    pricingPolicy?: PricingPolicy;
  }>();

  return <PricingPolicyForm pricingPolicy={pricingPolicy} />;
}
