/*
  Warnings:

  - You are about to drop the column `userId` on the `Pokemon` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedById` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Pokemon" DROP CONSTRAINT "Pokemon_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pokemon" DROP CONSTRAINT "Pokemon_userId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "userId",
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
