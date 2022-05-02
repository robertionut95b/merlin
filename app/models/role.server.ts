import { prisma } from "~/db.server";
import type { PrismaClient, Role } from "@prisma/client";
import { RelatedRoleModel } from "src/generated/zod";

export async function getRoles(
  opts?: Parameters<PrismaClient["role"]["findMany"]>[number]
): Promise<Role[]> {
  return prisma.role.findMany({
    ...opts,
  });
}

export async function getUniqueRole(
  opts: Parameters<PrismaClient["role"]["findUnique"]>[number]
): Promise<Role | null> {
  return prisma.role.findUnique({
    ...opts,
  });
}

export async function getRolesWithPagination(
  opts?: Parameters<PrismaClient["role"]["findMany"]>[number]
): Promise<{
  roles: Role[];
  paginationMeta: {
    total: number;
  };
}> {
  const [total, roles] = await prisma.$transaction([
    prisma.role.count({ where: { ...opts?.where } }),
    prisma.role.findMany({
      ...opts,
    }),
  ]);

  return {
    roles,
    paginationMeta: {
      total,
    },
  };
}

export function validateCreateRole(
  data: Parameters<PrismaClient["role"]["create"]>[0]
) {
  return RelatedRoleModel.safeParse(data);
}

export function createRole(
  data: Parameters<PrismaClient["role"]["create"]>[0]
): ReturnType<typeof prisma.role.create> {
  return prisma.role.create(data);
}

export function updateRole(
  data: Parameters<PrismaClient["role"]["update"]>[0]
): ReturnType<typeof prisma.role.update> {
  return prisma.role.update(data);
}
