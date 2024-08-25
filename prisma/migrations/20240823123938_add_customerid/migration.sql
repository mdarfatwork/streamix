/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");
