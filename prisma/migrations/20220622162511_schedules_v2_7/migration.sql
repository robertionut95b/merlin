/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `time` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "dayOfWeek",
DROP COLUMN "timeSlot",
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
