/*
  Warnings:

  - You are about to drop the column `planId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_planId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "planId",
ADD COLUMN     "plan" "PlanStatus" NOT NULL DEFAULT 'FREE';

-- DropTable
DROP TABLE "Plan";
