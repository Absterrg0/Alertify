/*
  Warnings:

  - The required column `droplertId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `apiKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "droplertId" TEXT NOT NULL,
ALTER COLUMN "apiKey" SET NOT NULL;
