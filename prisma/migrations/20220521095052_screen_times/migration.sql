/*
  Warnings:

  - Added the required column `runHours` to the `ScreenSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `ScreenSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScreenSchedule" ADD COLUMN     "runHours" TEXT NOT NULL,
ADD COLUMN     "runtime" INTEGER NOT NULL;
