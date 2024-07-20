/*
  Warnings:

  - You are about to drop the column `comments` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivery` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `orders` table. All the data in the column will be lost.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "comments",
DROP COLUMN "delivery",
DROP COLUMN "payment",
ADD COLUMN     "address" JSONB NOT NULL;
