import type { Prisma, PrismaClient, Screening } from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { prisma } from "~/db.server";

export const getScreeningsWithPagination = async (
  opts?: Parameters<PrismaClient["screening"]["findMany"]>[number]
): Promise<PaginatedResult<Screening>> => {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<Screening, Prisma.ScreeningFindManyArgs>(prisma.screening, {
    ...opts,
  });
};

export const getScreenings = async (
  opts?: Parameters<PrismaClient["screening"]["findMany"]>[number]
): Promise<Screening[]> => {
  return prisma.screening.findMany({
    ...opts,
  });
};
