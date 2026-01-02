/*
  Warnings:

  - A unique constraint covering the columns `[pseudoId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_pseudoId_key" ON "Team"("pseudoId");
