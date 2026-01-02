-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pseudoId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Team_pseudoId_idx" ON "Team"("pseudoId");

-- CreateIndex
CREATE INDEX "Team_createdById_idx" ON "Team"("createdById");

-- CreateIndex
CREATE INDEX "Team_updatedById_idx" ON "Team"("updatedById");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_pseudoId_fkey" FOREIGN KEY ("pseudoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
