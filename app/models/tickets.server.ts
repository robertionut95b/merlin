import type { Prisma, PrismaClient, Ticket } from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { prisma } from "~/db.server";

export const getTicketsWithPagination = async (
  opts?: Parameters<PrismaClient["ticket"]["findMany"]>[number],
  paginationOpts?: { page?: number }
): Promise<PaginatedResult<Ticket>> => {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<Ticket, Prisma.TicketFindManyArgs>(
    prisma.ticket,
    {
      ...opts,
    },
    { page: paginationOpts?.page || 1 }
  );
};

export const getTickets = async (
  opts?: Parameters<PrismaClient["ticket"]["findMany"]>[number]
) =>
  prisma.ticket.findMany({
    ...opts,
  });

export const getUniqueTicket = async (
  opts: Parameters<PrismaClient["ticket"]["findUnique"]>[number]
) =>
  prisma.ticket.findUnique({
    ...opts,
  });

export const createTicket = async (
  opts: Parameters<PrismaClient["ticket"]["create"]>[number]
) =>
  prisma.ticket.create({
    ...opts,
  });
