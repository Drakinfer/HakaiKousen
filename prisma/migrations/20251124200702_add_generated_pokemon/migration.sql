-- CreateTable
CREATE TABLE "GeneratedPokemon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lvl" INTEGER NOT NULL,
    "sex" TEXT,
    "nature" TEXT,
    "subNature" TEXT,
    "talent" TEXT,
    "breedingMove" TEXT,
    "shiny" BOOLEAN NOT NULL DEFAULT false,
    "baron" BOOLEAN NOT NULL DEFAULT false,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedPokemon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneratedPokemon" ADD CONSTRAINT "GeneratedPokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
