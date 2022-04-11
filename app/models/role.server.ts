import { prisma } from "~/db.server";
import { PrismaClient, Role } from "@prisma/client";
import { RelatedRoleModel } from "src/generated/zod";

export async function getRoles(
  opts?: Parameters<PrismaClient["role"]["findMany"]>[number]
): Promise<Role[]> {
  return prisma.role.findMany({
    ...opts,
  });
}

export function validateCreateRole(
  data: Parameters<PrismaClient["role"]["create"]>[0]
) {
  return RelatedRoleModel.safeParse(data);
}
