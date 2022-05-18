-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "SettingsCategory" AS ENUM ('General', 'Security', 'Locales');

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "version" DOUBLE PRECISION NOT NULL,
    "status" "RepositoryStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationSettings" (
    "id" TEXT NOT NULL,
    "category" "SettingsCategory" NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationSettings_pkey" PRIMARY KEY ("id")
);
