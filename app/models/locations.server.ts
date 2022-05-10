import type { PrismaClient } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getLocations(
  opts?: Parameters<PrismaClient["location"]["findMany"]>[number]
): Promise<ReturnType<typeof prisma.location.findMany>> {
  return prisma.location.findMany({
    ...opts,
  });
}

export async function getPermissionsWithPagination(
  opts?: Parameters<PrismaClient["location"]["findMany"]>[number]
): Promise<{
  locations: Awaited<ReturnType<typeof prisma.location.findMany>>;
  paginationMeta: {
    total: number;
  };
}> {
  const [total, locations] = await prisma.$transaction([
    prisma.location.count({ where: { ...opts?.where } }),
    prisma.location.findMany({
      ...opts,
    }),
  ]);

  return {
    locations,
    paginationMeta: {
      total,
    },
  };
}
