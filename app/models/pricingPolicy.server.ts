import type { PricingPolicy, Prisma, PrismaClient } from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { prisma } from "~/db.server";

export async function getPricingPolicies(
  opts?: Parameters<PrismaClient["pricingPolicy"]["findMany"]>[number]
): Promise<ReturnType<typeof prisma.pricingPolicy.findMany>> {
  return prisma.pricingPolicy.findMany({
    ...opts,
  });
}

export const getPricingPoliciesWithPagination = (
  opts?: Parameters<PrismaClient["pricingPolicy"]["findMany"]>[number],
  paginationOpts?: { page?: number }
): Promise<PaginatedResult<PricingPolicy>> => {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<PricingPolicy, Prisma.PricingPolicyFindManyArgs>(
    prisma.pricingPolicy,
    {
      ...opts,
    },
    { page: paginationOpts?.page || 1 }
  );
};

export const createPricingPolicy = (
  data: Parameters<PrismaClient["pricingPolicy"]["create"]>[number]
): ReturnType<typeof prisma.pricingPolicy.create> => {
  return prisma.pricingPolicy.create(data);
};

export const getUniquePricingPolicy = (
  opts: Parameters<PrismaClient["pricingPolicy"]["findUnique"]>[number]
) => {
  return prisma.pricingPolicy.findUnique(opts);
};
