/*
  Warnings:

  - You are about to drop the column `end` on the `ScreenEvent` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ScreenEvent` table. All the data in the column will be lost.
  - You are about to drop the column `pricingPolicyId` on the `ScreenEvent` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `ScreenEvent` table. All the data in the column will be lost.
  - You are about to drop the column `theatreId` on the `ScreenEvent` table. All the data in the column will be lost.
  - You are about to drop the column `theatreId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `EventRecurrence` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endRecur` to the `ScreenEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventRecurrence" DROP CONSTRAINT "EventRecurrence_screenEventId_fkey";

-- DropForeignKey
ALTER TABLE "ScreenEvent" DROP CONSTRAINT "ScreenEvent_pricingPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "ScreenEvent" DROP CONSTRAINT "ScreenEvent_theatreId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_theatreId_fkey";

-- DropIndex
DROP INDEX "Ticket_theatreId_key";

-- AlterTable
ALTER TABLE "ScreenEvent" DROP COLUMN "end",
DROP COLUMN "name",
DROP COLUMN "pricingPolicyId",
DROP COLUMN "start",
DROP COLUMN "theatreId",
ADD COLUMN     "daysOfWeek" "DayOfWeek"[],
ADD COLUMN     "endRecur" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TEXT DEFAULT E'23:59:59',
ADD COLUMN     "startRecur" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startTime" TEXT DEFAULT E'00:00:00';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "theatreId";

-- DropTable
DROP TABLE "EventRecurrence";

-- CreateTable
CREATE TABLE "_ScreenEventToTheatre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PricingPolicyToScreenEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScreenEventToTheatre_AB_unique" ON "_ScreenEventToTheatre"("A", "B");

-- CreateIndex
CREATE INDEX "_ScreenEventToTheatre_B_index" ON "_ScreenEventToTheatre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PricingPolicyToScreenEvent_AB_unique" ON "_PricingPolicyToScreenEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_PricingPolicyToScreenEvent_B_index" ON "_PricingPolicyToScreenEvent"("B");

-- AddForeignKey
ALTER TABLE "_ScreenEventToTheatre" ADD FOREIGN KEY ("A") REFERENCES "ScreenEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScreenEventToTheatre" ADD FOREIGN KEY ("B") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PricingPolicyToScreenEvent" ADD FOREIGN KEY ("A") REFERENCES "PricingPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PricingPolicyToScreenEvent" ADD FOREIGN KEY ("B") REFERENCES "ScreenEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
