/*
  Warnings:

  - Added the required column `columns` to the `Theatre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rows` to the `Theatre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "columns" INTEGER NOT NULL,
ADD COLUMN     "rows" INTEGER NOT NULL;
