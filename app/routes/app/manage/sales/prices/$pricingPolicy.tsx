import type { PricingPolicy } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorizationLoader } from "src/helpers/remix.rbac";
import PricingPolicyForm from "~/components/forms/PricingPolicyForm";
import { getUniquePricingPolicy } from "~/models/pricingPolicy.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
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

export default function PricingPolicyPage() {
  const { pricingPolicy } = useLoaderData<{
    pricingPolicy?: PricingPolicy;
  }>();

  return (
    <div>
      <PricingPolicyForm pricingPolicy={pricingPolicy} readOnly />
    </div>
  );
}
