/*
  Warnings:

  - The primary key for the `Layout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserPrefferedLayout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Website` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserPrefferedLayout" DROP CONSTRAINT "UserPrefferedLayout_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "UserPrefferedLayout" DROP CONSTRAINT "UserPrefferedLayout_userId_fkey";

-- DropForeignKey
ALTER TABLE "Website" DROP CONSTRAINT "Website_userId_fkey";

-- AlterTable
ALTER TABLE "Layout" DROP CONSTRAINT "Layout_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Layout_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Layout_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserPrefferedLayout" DROP CONSTRAINT "UserPrefferedLayout_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "layoutId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserPrefferedLayout_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserPrefferedLayout_id_seq";

-- AlterTable
ALTER TABLE "Website" DROP CONSTRAINT "Website_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Website_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Website_id_seq";

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrefferedLayout" ADD CONSTRAINT "UserPrefferedLayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrefferedLayout" ADD CONSTRAINT "UserPrefferedLayout_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
