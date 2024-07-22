/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "products";
