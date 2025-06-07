/*
  Warnings:

  - Added the required column `ownerName` to the `Debut` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fen` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debut" ADD COLUMN     "ownerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "fen" TEXT NOT NULL;
