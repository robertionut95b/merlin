/*
  Warnings:

  - A unique constraint covering the columns `[userId,screenEventId,time]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ticket_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_userId_screenEventId_time_key" ON "Ticket"("userId", "screenEventId", "time");
