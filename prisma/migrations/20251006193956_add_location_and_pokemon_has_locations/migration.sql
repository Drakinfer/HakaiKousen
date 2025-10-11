-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonHasLocations" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "PokemonHasLocations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonHasLocations" ADD CONSTRAINT "PokemonHasLocations_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonHasLocations" ADD CONSTRAINT "PokemonHasLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
