import type { Prisma, PrismaClient, Screening } from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { prisma } from "~/db.server";

export const getScreeningsWithPagination = async (
  opts?: Parameters<PrismaClient["screening"]["findMany"]>[number],
  paginationOpts?: { page?: number }
): Promise<PaginatedResult<Screening>> => {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<Screening, Prisma.ScreeningFindManyArgs>(
    prisma.screening,
    {
      ...opts,
    },
    { page: paginationOpts?.page || 1 }
  );
};

export const getScreenings = async (
  opts?: Parameters<PrismaClient["screening"]["findMany"]>[number]
): Promise<Screening[]> => {
  return prisma.screening.findMany({
    ...opts,
  });
};

export const getUniqueScreeningById = async (screeningId: string) => {
  return prisma.screening.findUnique({
    where: {
      imdbId: screeningId,
    },
  });
};

export const getUniqueScreening = async (
  opts: Parameters<PrismaClient["screening"]["findUnique"]>[number]
) => {
  return prisma.screening.findUnique({
    ...opts,
  });
};

export const updateScreening = async (
  data: Parameters<PrismaClient["screening"]["update"]>[number]
) => prisma.screening.update(data);

export const createScreening = async (
  data: Parameters<PrismaClient["screening"]["create"]>[number]
) => prisma.screening.create(data);
