import type { ActionType, ObjectType } from "@prisma/client";
import { prisma } from "~/db.server";

export const _validate = async (
  actionType: ActionType | ActionType[],
  objectType: ObjectType | ObjectType[],
  role: string
): Promise<boolean> => {
  const actions = Array.isArray(actionType) ? actionType : [actionType];
  const objects = Array.isArray(objectType) ? objectType : [objectType];

  const perm = await prisma.permission.findMany({
    where: {
      AND: {
        Role: {
          name: {
            equals: role,
            mode: "insensitive",
          },
        },
        AND: {
          OR: [...actions.map((action) => ({ action: { equals: action } }))],
          AND: {
            OR: [
              ...objects.map((object) => ({ objectType: { equals: object } })),
            ],
          },
        },
      },
    },
  });

  let valid = false;
  perm.forEach((p) => {
    valid = valid || p.allowed;
  });

  return valid;
};

export const _getAccessibleResources = async (
  actionType: ActionType | ActionType[],
  role: string
): Promise<string[]> => {
  const actions = Array.isArray(actionType) ? actionType : [actionType];
  const perm = await prisma.permission.findMany({
    where: {
      AND: {
        Role: {
          name: {
            equals: role,
            mode: "insensitive",
          },
        },
        OR: [...actions.map((action) => ({ action: { equals: action } }))],
      },
    },
    select: {
      objectType: true,
    },
  });

  return perm.map((p) => p.objectType);
};
