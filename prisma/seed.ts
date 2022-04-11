import { ActionType, ObjectType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.user.create({
    data: {
      email: "admin@localhost.org",
      username: "admin",
      role: {
        create: {
          name: "Admin",
          description: "Administrative users",
          permissions: {
            create: {
              action: "All",
              allowed: true,
              objectType: ObjectType.All,
            },
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "user@localhost.org",
      username: "user",
      role: {
        create: {
          name: "Users",
          description: "Public users",
          permissions: {
            create: {
              action: ActionType.Read,
              allowed: true,
              objectType: ObjectType.All,
            },
          },
        },
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "Moderators",
      description: "Moderating team",
      permissions: {
        createMany: {
          data: [
            {
              action: ActionType.All,
              allowed: true,
              objectType: ObjectType.Location,
            },
          ],
        },
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "Front Office Sales",
      description: "Front Office sales team",
      permissions: {
        createMany: {
          data: [
            {
              action: ActionType.All,
              allowed: true,
              objectType: ObjectType.Sales,
            },
          ],
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
