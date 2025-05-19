/*
  Warnings:

  - Added the required column `side` to the `Debut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debut" ADD COLUMN     "side" TEXT NOT NULL;
