import { prisma } from "~/db.server";
import { PrismaClient } from "@prisma/client";
import { PermissionModel } from "src/generated/zod";

export async function getPermissions(
  opts?: Parameters<PrismaClient["permission"]["findMany"]>[number]
): Promise<ReturnType<typeof prisma.permission.findMany>> {
  return prisma.permission.findMany({
    ...opts,
  });
}

export async function getPermissionsWithPagination(
  opts?: Parameters<PrismaClient["permission"]["findMany"]>[number]
): Promise<{
  permissions: Awaited<ReturnType<typeof prisma.permission.findMany>>;
  paginationMeta: {
    total: number;
  };
}> {
  const [total, permissions] = await prisma.$transaction([
    prisma.permission.count({ where: { ...opts?.where } }),
    prisma.permission.findMany({
      ...opts,
    }),
  ]);

  return {
    permissions,
    paginationMeta: {
      total,
    },
  };
}

export async function createPermission(
  opts: Parameters<PrismaClient["permission"]["create"]>[number]
): Promise<ReturnType<typeof prisma.permission.create>> {
  return prisma.permission.create({
    ...opts,
  });
}

export const validateCreatePermission = (
  object: Parameters<PrismaClient["permission"]["create"]>[number]["data"]
) => PermissionModel.safeParse(object);
