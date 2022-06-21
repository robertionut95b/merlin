import type { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "~/db.server";
import { hashPassword } from "~/services/utils";

const generateRandomString = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

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

export const createUser = async (
  email: string,
  password: string = generateRandomString()
) => {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          password: hashedPassword,
          active: true,
        },
      },
      role: {
        connectOrCreate: {
          create: {
            name: "Users",
            description: "Public users",
          },
          where: {
            name: "Users",
          },
        },
      },
    },
  });
};

export const createUserWithRole = async (
  email: string,
  username: string,
  role: string,
  password: string = generateRandomString()
) => {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          password: hashedPassword,
          active: true,
        },
      },
      username,
      role: {
        connectOrCreate: {
          create: {
            name: "Users",
            description: "Public users",
          },
          where: {
            name: role,
          },
        },
      },
    },
  });
};

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, include: { role: true } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, include: { role: true } });
}

export async function deleteUserByEmail(email: string) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: string, password: string) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
      role: true,
    },
  });

  const lastActivePassword = await prisma.password.findFirst({
    where: {
      active: true,
    },
  });

  if (!userWithPassword || !lastActivePassword) {
    return null;
  }

  const isValid = await bcrypt.compare(password, lastActivePassword.password);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
