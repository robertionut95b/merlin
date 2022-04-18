/*
  Warnings:

  - A unique constraint covering the columns `[objectType,action]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_objectType_action_key" ON "Permission"("objectType", "action");
