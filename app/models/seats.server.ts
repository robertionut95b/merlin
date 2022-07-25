import type { PrismaClient, Seat } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getSeats(
  opts?: Parameters<PrismaClient["seat"]["findMany"]>[number]
): Promise<Seat[]> {
  return prisma.seat.findMany({
    ...opts,
  });
}
