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
          name: "Administrators",
          description: "Administrative team",
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

  await prisma.screening.create({
    data: {
      title: "Deep water",
      description:
        "A well-to-do husband who allows his wife to have affairs in order to avoid a divorce becomes a prime suspect in the disappearance of her lovers.",
      duration: 115,
      imdbId: "tt2180339",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNTE1M2NjNDgtYjQ2Ny00YTMzLWJiYWQtMTdmM2Q2YjA1MDg1XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
      rating: "R",
      release: new Date(2022, 3, 18),
    },
  });

  await prisma.screening.create({
    data: {
      title: "Top Gun: Maverick",
      description:
        "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
      duration: 131,
      imdbId: "tt1745960",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMmIwZDMyYWUtNTU0ZS00ODJhLTg2ZmEtMTk5ZmYzODcxODYxXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      rating: "PG-13",
      release: new Date(2022, 5, 25),
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
