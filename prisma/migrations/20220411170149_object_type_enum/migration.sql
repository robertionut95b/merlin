/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `objectType` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('All', 'Address', 'Location', 'Spot', 'Theatre', 'Role', 'Permission', 'User');

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "objectType",
ADD COLUMN     "objectType" "ObjectType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
