/*
  Warnings:

  - A unique constraint covering the columns `[ageCategory,ticketType]` on the table `PricingPolicy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PricingPolicy_ageCategory_ticketType_key" ON "PricingPolicy"("ageCategory", "ticketType");
