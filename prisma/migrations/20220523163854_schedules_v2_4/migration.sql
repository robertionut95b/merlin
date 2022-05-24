-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('TwoD', 'ThreeD', 'IMAX', 'FourD');

-- AlterTable
ALTER TABLE "PricingPolicy" ADD COLUMN     "ticketType" "TicketType" NOT NULL DEFAULT E'TwoD';
