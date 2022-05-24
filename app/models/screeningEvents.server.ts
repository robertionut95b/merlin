import type { Prisma, PrismaClient, ScreenEvent } from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { prisma } from "~/db.server";

export const getScreeningEventsWithPagination = async (
  opts?: Parameters<PrismaClient["screenEvent"]["findMany"]>[number]
): Promise<PaginatedResult<ScreenEvent>> => {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<ScreenEvent, Prisma.ScreenEventFindManyArgs>(
    prisma.screenEvent,
    {
      ...opts,
    }
  );
};

export const getScreeningEvents = async (
  opts?: Parameters<PrismaClient["screenEvent"]["findMany"]>[number]
): Promise<ScreenEvent[]> => {
  return prisma.screenEvent.findMany({
    ...opts,
  });
};
