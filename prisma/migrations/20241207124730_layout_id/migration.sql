/*
  Warnings:

  - You are about to drop the `_AlertsToLayout` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `layoutId` to the `Alerts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AlertsToLayout" DROP CONSTRAINT "_AlertsToLayout_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlertsToLayout" DROP CONSTRAINT "_AlertsToLayout_B_fkey";

-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "layoutId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AlertsToLayout";

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
