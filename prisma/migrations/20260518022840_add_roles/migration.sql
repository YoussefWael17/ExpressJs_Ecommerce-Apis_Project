-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
