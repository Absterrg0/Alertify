/*
  Warnings:

  - You are about to drop the column `category` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `URL` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the `Alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLayouts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Website` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `backgroundColor` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borderColor` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textColor` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `style` on the `Layout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `url` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('ALERT', 'ALERT_DIALOG', 'TOAST');

-- CreateEnum
CREATE TYPE "StyleType" AS ENUM ('NATIVE', 'GRADIENT', 'LOGO');

-- DropForeignKey
ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLayouts" DROP CONSTRAINT "UserLayouts_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "UserLayouts" DROP CONSTRAINT "UserLayouts_userId_fkey";

-- DropIndex
DROP INDEX "Website_URL_key";

-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "backgroundColor" TEXT NOT NULL,
ADD COLUMN     "borderColor" TEXT NOT NULL,
ADD COLUMN     "textColor" TEXT NOT NULL,
ADD COLUMN     "type" "LayoutType" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "style",
ADD COLUMN     "style" "StyleType" NOT NULL;

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "URL",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "url" VARCHAR(2048) NOT NULL;

-- DropTable
DROP TABLE "Alerts";

-- DropTable
DROP TABLE "UserLayouts";

-- DropEnum
DROP TYPE "LayoutDivision";

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "LayoutType" NOT NULL,
    "style" "StyleType" NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Layout_userId_idx" ON "Layout"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Website_url_key" ON "Website"("url");

-- CreateIndex
CREATE INDEX "Website_userId_idx" ON "Website"("userId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
