-- AlterTable
ALTER TABLE "PokemonGenerationHasTalents" ALTER COLUMN "hidden" SET DEFAULT false;

-- CreateTable
CREATE TABLE "HomePageParagraph" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "isNotification" BOOLEAN NOT NULL DEFAULT false,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "HomePageParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomePageParagraph_createdById_idx" ON "HomePageParagraph"("createdById");

-- CreateIndex
CREATE INDEX "HomePageParagraph_updatedById_idx" ON "HomePageParagraph"("updatedById");

-- AddForeignKey
ALTER TABLE "HomePageParagraph" ADD CONSTRAINT "HomePageParagraph_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageParagraph" ADD CONSTRAINT "HomePageParagraph_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
