-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "status" "WebsiteStatus" NOT NULL DEFAULT 'ACTIVE';
