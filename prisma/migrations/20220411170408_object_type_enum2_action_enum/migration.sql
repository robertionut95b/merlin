/*
  Warnings:

  - Changed the type of `action` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('All', 'Create', 'Read', 'Update', 'Delete');

-- AlterEnum
ALTER TYPE "ObjectType" ADD VALUE 'Sales';

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "action",
ADD COLUMN     "action" "ActionType" NOT NULL;
