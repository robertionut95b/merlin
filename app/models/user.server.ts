import { prisma } from "~/db.server";
import { PrismaClient, User } from "@prisma/client";

export async function getUsers(
  opts?: Parameters<PrismaClient["user"]["findMany"]>[number]
): Promise<User[]> {
  return prisma.user.findMany({
    include: {
      role: true,
    },
    ...opts,
  });
}

export async function getUsersWithPagination(
  opts?: Parameters<PrismaClient["user"]["findMany"]>[number]
): Promise<{
  users: User[];
  paginationMeta: {
    total: number;
  };
}> {
  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where: { ...opts?.where } }),
    prisma.user.findMany({
      include: {
        role: true,
      },
      ...opts,
    }),
  ]);

  return {
    users,
    paginationMeta: {
      total,
    },
  };
}
