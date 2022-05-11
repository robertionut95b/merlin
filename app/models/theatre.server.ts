import type { PrismaClient } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getTheatres(
  opts?: Parameters<PrismaClient["theatre"]["findMany"]>[number]
): Promise<ReturnType<typeof prisma.theatre.findMany>> {
  return prisma.theatre.findMany({
    ...opts,
  });
}

export async function getTheatresWithPagination(
  opts?: Parameters<PrismaClient["theatre"]["findMany"]>[number]
): Promise<{
  theatres: Awaited<ReturnType<typeof prisma.theatre.findMany>>;
  paginationMeta: {
    total: number;
  };
}> {
  const [total, theatres] = await prisma.$transaction([
    prisma.theatre.count({ where: { ...opts?.where } }),
    prisma.theatre.findMany({
      ...opts,
    }),
  ]);

  return {
    theatres,
    paginationMeta: {
      total,
    },
  };
}

export function createTheatre(
  data: Parameters<PrismaClient["theatre"]["create"]>[0]
) {
  return prisma.theatre.create(data);
}

export function getUniqueTheatre(
  opts: Parameters<PrismaClient["theatre"]["findUnique"]>[number]
) {
  return prisma.theatre.findUnique({
    ...opts,
  });
}
