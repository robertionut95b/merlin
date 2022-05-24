/*
  Warnings:

  - The values [ScreenSchedule,Reservation] on the enum `ObjectType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `screenScheduleId` on the `PricingPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `screenScheduleId` on the `Screening` table. All the data in the column will be lost.
  - You are about to drop the column `screenScheduleId` on the `Theatre` table. All the data in the column will be lost.
  - You are about to drop the column `screenScheduleId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScreenSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- AlterEnum
BEGIN;
CREATE TYPE "ObjectType_new" AS ENUM ('All', 'Address', 'Location', 'Spot', 'Theatre', 'Role', 'Permission', 'User', 'Sales', 'Screening', 'ScreenEvent', 'PricingPolicy', 'Ticket');
ALTER TABLE "Permission" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TYPE "ObjectType" RENAME TO "ObjectType_old";
ALTER TYPE "ObjectType_new" RENAME TO "ObjectType";
DROP TYPE "ObjectType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PricingPolicy" DROP CONSTRAINT "PricingPolicy_screenScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_screenScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_theatreId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_screenScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "Theatre" DROP CONSTRAINT "Theatre_screenScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_screenScheduleId_fkey";

-- DropIndex
DROP INDEX "Ticket_screenScheduleId_key";

-- AlterTable
ALTER TABLE "PricingPolicy" DROP COLUMN "screenScheduleId";

-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "screenScheduleId";

-- AlterTable
ALTER TABLE "Theatre" DROP COLUMN "screenScheduleId";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "screenScheduleId",
ADD COLUMN     "screenEventId" TEXT;

-- DropTable
DROP TABLE "Reservation";

-- DropTable
DROP TABLE "ScreenSchedule";

-- CreateTable
CREATE TABLE "EventRecurrence" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "daysOfWeek" "DayOfWeek"[],
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "startRecur" TIMESTAMP(3) NOT NULL,
    "endRecur" TIMESTAMP(3) NOT NULL,
    "screenEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "theatreId" TEXT NOT NULL,
    "screeningId" TEXT NOT NULL,
    "pricingPolicyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventRecurrence_groupId_key" ON "EventRecurrence"("groupId");

-- AddForeignKey
ALTER TABLE "EventRecurrence" ADD CONSTRAINT "EventRecurrence_screenEventId_fkey" FOREIGN KEY ("screenEventId") REFERENCES "ScreenEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenEvent" ADD CONSTRAINT "ScreenEvent_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenEvent" ADD CONSTRAINT "ScreenEvent_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("imdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenEvent" ADD CONSTRAINT "ScreenEvent_pricingPolicyId_fkey" FOREIGN KEY ("pricingPolicyId") REFERENCES "PricingPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_screenEventId_fkey" FOREIGN KEY ("screenEventId") REFERENCES "ScreenEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
