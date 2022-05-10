/*
  Warnings:

  - You are about to drop the `Spot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_theatreId_fkey";

-- DropTable
DROP TABLE "Spot";

-- CreateTable
CREATE TABLE "Seat" (
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "theatreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("row","column","theatreId")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
