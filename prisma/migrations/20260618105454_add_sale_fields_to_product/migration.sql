/*
  Warnings:

  - You are about to drop the column `isSale` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isSale",
ADD COLUMN     "saleEndDate" TIMESTAMP(3),
ADD COLUMN     "salePercentage" INTEGER,
ADD COLUMN     "saleStartDate" TIMESTAMP(3);
