/*
  Warnings:

  - Made the column `createdById` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Pokemon" DROP CONSTRAINT "Pokemon_createdById_fkey";

-- AlterTable
ALTER TABLE "Pokemon" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
