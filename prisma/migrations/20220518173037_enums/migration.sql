-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ObjectType" ADD VALUE 'Screening';
ALTER TYPE "ObjectType" ADD VALUE 'ScreenSchedule';
ALTER TYPE "ObjectType" ADD VALUE 'Reservation';
ALTER TYPE "ObjectType" ADD VALUE 'PricingPolicy';
ALTER TYPE "ObjectType" ADD VALUE 'Ticket';
