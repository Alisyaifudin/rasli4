/*
  Warnings:

  - Added the required column `name` to the `Constellation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radius` to the `Constellation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Constellation" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "radius" DOUBLE PRECISION NOT NULL;
