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

export const createScreeningEvent = async (
  opts: Parameters<PrismaClient["screenEvent"]["create"]>[number]
): Promise<ScreenEvent> => {
  return prisma.screenEvent.create({
    ...opts,
  });
};

export const getUniqueScreeningEvent = async (
  opts: Parameters<PrismaClient["screenEvent"]["findUnique"]>[number]
): Promise<ScreenEvent | null> => {
  return prisma.screenEvent.findUnique({
    ...opts,
  });
};

export const updateScreeningEvent = async (
  data: Parameters<PrismaClient["screenEvent"]["update"]>[number]
) => prisma.screenEvent.update(data);
