import type {
  ObjectType,
  Permission,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { PermissionModel } from "src/generated/zod";
import { prisma } from "~/db.server";

export async function getPermissions(
  opts?: Parameters<PrismaClient["permission"]["findMany"]>[number]
): Promise<ReturnType<typeof prisma.permission.findMany>> {
  return prisma.permission.findMany({
    ...opts,
  });
}

export async function getPermissionsWithPagination(
  opts?: Parameters<PrismaClient["permission"]["findMany"]>[number],
  paginationOpts?: { page?: number }
): Promise<PaginatedResult<Permission>> {
  const paginate = createPaginator({ perPage: 10 });
  return paginate<Permission, Prisma.PermissionFindManyArgs>(
    prisma.permission,
    {
      ...opts,
    },
    { page: paginationOpts?.page || 1 }
  );
}

export async function createPermission(
  opts: Parameters<PrismaClient["permission"]["create"]>[number]
): Promise<ReturnType<typeof prisma.permission.create>> {
  return prisma.permission.create({
    ...opts,
  });
}

export async function createManyPermissions(
  opts: Exclude<
    Parameters<PrismaClient["permission"]["createMany"]>[number],
    undefined
  >
): Promise<ReturnType<typeof prisma.permission.createMany>> {
  return prisma.permission.createMany({
    ...opts,
  });
}

export const validateCreatePermission = (
  object: Parameters<PrismaClient["permission"]["create"]>[number]["data"]
) => PermissionModel.safeParse(object);

export const validateCreatePermissions = (
  object: Parameters<PrismaClient["permission"]["createMany"]>[number]
) => {
  const d = object?.data as Prisma.PermissionCreateManyInput[];
  if (!d) {
    throw new Error("Missing data");
  }

  return d.map((o) =>
    PermissionModel.safeParse({
      ...o,
      action: Array.isArray(o.action) ? o.action : [o.action],
    })
  );
};

export const validateHigherPermission = async (
  roleId: string,
  objectType: ObjectType
) => {
  const perm1 = await getPermissions({
    where: {
      action: "All",
      roleId,
      objectType,
      allowed: true,
    },
  });
  const perm2 = await getPermissions({
    where: {
      action: "All",
      roleId,
      objectType: "All",
      allowed: true,
    },
  });

  return perm1?.length > 0 || perm2?.length > 0;
};
