/*
  Warnings:

  - You are about to drop the `UserPrefferedLayout` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[URL]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserPrefferedLayout" DROP CONSTRAINT "UserPrefferedLayout_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "UserPrefferedLayout" DROP CONSTRAINT "UserPrefferedLayout_userId_fkey";

-- DropTable
DROP TABLE "UserPrefferedLayout";

-- CreateTable
CREATE TABLE "Alerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLayouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,

    CONSTRAINT "UserLayouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlertsToLayout" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlertsToLayout_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLayouts_layoutId_userId_key" ON "UserLayouts"("layoutId", "userId");

-- CreateIndex
CREATE INDEX "_AlertsToLayout_B_index" ON "_AlertsToLayout"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Website_URL_key" ON "Website"("URL");

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLayouts" ADD CONSTRAINT "UserLayouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLayouts" ADD CONSTRAINT "UserLayouts_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertsToLayout" ADD CONSTRAINT "_AlertsToLayout_A_fkey" FOREIGN KEY ("A") REFERENCES "Alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertsToLayout" ADD CONSTRAINT "_AlertsToLayout_B_fkey" FOREIGN KEY ("B") REFERENCES "Layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
