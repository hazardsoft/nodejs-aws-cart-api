/*
  Warnings:

  - You are about to drop the column `address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - Added the required column `delivery` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "address",
DROP COLUMN "total",
ADD COLUMN     "delivery" JSONB NOT NULL;
