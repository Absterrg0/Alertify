-- CreateEnum
CREATE TYPE "websiteStatus" AS ENUM ('PENDING', 'ACTIVE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "status" "websiteStatus" NOT NULL DEFAULT 'PENDING';
