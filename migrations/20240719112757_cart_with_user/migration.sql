/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
