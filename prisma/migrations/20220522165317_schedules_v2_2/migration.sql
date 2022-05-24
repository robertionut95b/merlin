/*
  Warnings:

  - Made the column `screenEventId` on table `EventRecurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `screenEventId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventRecurrence" DROP CONSTRAINT "EventRecurrence_screenEventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_screenEventId_fkey";

-- AlterTable
ALTER TABLE "EventRecurrence" ALTER COLUMN "screenEventId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "screenEventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventRecurrence" ADD CONSTRAINT "EventRecurrence_screenEventId_fkey" FOREIGN KEY ("screenEventId") REFERENCES "ScreenEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_screenEventId_fkey" FOREIGN KEY ("screenEventId") REFERENCES "ScreenEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
