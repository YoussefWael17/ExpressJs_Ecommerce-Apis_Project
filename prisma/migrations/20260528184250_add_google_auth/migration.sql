/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIALS',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
