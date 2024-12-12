/*
  Warnings:

  - Added the required column `endpoint` to the `ApiRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiRequest" ADD COLUMN     "endpoint" TEXT NOT NULL;
