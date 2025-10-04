-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PokemonCategory" AS ENUM ('Physique', 'Spéciale', 'Autre');

-- CreateEnum
CREATE TYPE "public"."Range" AS ENUM ('Cible', 'Rayon', 'Zone', 'Zone Alliée', 'Zone Ennemie', 'Personnel', 'Sonore');

-- CreateEnum
CREATE TYPE "public"."breed_rating" AS ENUM ('♂ uniquement', '7♂:1♀', '6♂:2♀', '5♂:3♀', '4♂:4♀', '3♂:5♀', '2♂:6♀', '1♂:7♀', '♀ uniquement');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attaque" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastTypeId" INTEGER,

    CONSTRAINT "Attaque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueGeneration" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "generationId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "energie1" INTEGER NOT NULL,
    "energie2" INTEGER,
    "category" "public"."PokemonCategory" NOT NULL DEFAULT 'Physique',
    "range" "public"."Range" NOT NULL DEFAULT 'Cible',
    "precision" INTEGER NOT NULL,
    "damage_base" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AttaqueGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueBreeding" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,

    CONSTRAINT "AttaqueBreeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueCt" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "AttaqueCt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueDt" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "AttaqueDt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueLvl" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "learningWay" VARCHAR(50) NOT NULL,

    CONSTRAINT "AttaqueLvl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttaqueTutoring" (
    "id" SERIAL NOT NULL,
    "attaqueId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,

    CONSTRAINT "AttaqueTutoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evolution" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "evolutionWay" VARCHAR(50) NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Forme" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "form" VARCHAR(50),

    CONSTRAINT "Forme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Generation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonGenerationHasTalents" (
    "id" SERIAL NOT NULL,
    "talentId" INTEGER NOT NULL,
    "pokemonGenerationId" INTEGER NOT NULL,
    "hidden" BOOLEAN NOT NULL,

    CONSTRAINT "PokemonGenerationHasTalents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dexNumber" TEXT NOT NULL,
    "mainPicture" TEXT NOT NULL,
    "miniPicture" TEXT NOT NULL,
    "firstGenerationId" INTEGER,
    "typeId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonGeneration" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "generationId" INTEGER NOT NULL,
    "type1Id" INTEGER NOT NULL,
    "type2Id" INTEGER,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "breedRating" "public"."breed_rating" NOT NULL DEFAULT '♂ uniquement',
    "vita" INTEGER NOT NULL,
    "dex" INTEGER NOT NULL,
    "for" INTEGER NOT NULL,
    "conc" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "vol" INTEGER NOT NULL,
    "preEvolutionId" INTEGER,
    "preEvolutionWay" TEXT,
    "description" TEXT,

    CONSTRAINT "PokemonGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Talent" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "oldNameId" INTEGER,

    CONSTRAINT "Talent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TalentGeneration" (
    "id" SERIAL NOT NULL,
    "talentId" INTEGER NOT NULL,
    "generationId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TalentGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "bug" DOUBLE PRECISION NOT NULL,
    "dark" DOUBLE PRECISION NOT NULL,
    "dragon" DOUBLE PRECISION NOT NULL,
    "electric" DOUBLE PRECISION NOT NULL,
    "fairy" DOUBLE PRECISION NOT NULL,
    "fighting" DOUBLE PRECISION NOT NULL,
    "fire" DOUBLE PRECISION NOT NULL,
    "flying" DOUBLE PRECISION NOT NULL,
    "ghost" DOUBLE PRECISION NOT NULL,
    "grass" DOUBLE PRECISION NOT NULL,
    "ground" DOUBLE PRECISION NOT NULL,
    "ice" DOUBLE PRECISION NOT NULL,
    "normal" DOUBLE PRECISION NOT NULL,
    "poison" DOUBLE PRECISION NOT NULL,
    "psychic" DOUBLE PRECISION NOT NULL,
    "rock" DOUBLE PRECISION NOT NULL,
    "steel" DOUBLE PRECISION NOT NULL,
    "water" DOUBLE PRECISION NOT NULL,
    "generationId" INTEGER NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Competence" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonHasCompetences" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "competenceId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "PokemonHasCompetences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Attaque_lastTypeId_idx" ON "public"."Attaque"("lastTypeId");

-- CreateIndex
CREATE INDEX "AttaqueGeneration_attaqueId_idx" ON "public"."AttaqueGeneration"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueGeneration_generationId_idx" ON "public"."AttaqueGeneration"("generationId");

-- CreateIndex
CREATE INDEX "AttaqueGeneration_typeId_idx" ON "public"."AttaqueGeneration"("typeId");

-- CreateIndex
CREATE INDEX "AttaqueBreeding_attaqueId_idx" ON "public"."AttaqueBreeding"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueBreeding_pokemonGenerationId_idx" ON "public"."AttaqueBreeding"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "AttaqueCt_attaqueId_idx" ON "public"."AttaqueCt"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueCt_pokemonGenerationId_idx" ON "public"."AttaqueCt"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "AttaqueDt_attaqueId_idx" ON "public"."AttaqueDt"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueDt_pokemonGenerationId_idx" ON "public"."AttaqueDt"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "AttaqueLvl_attaqueId_idx" ON "public"."AttaqueLvl"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueLvl_pokemonGenerationId_idx" ON "public"."AttaqueLvl"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "AttaqueTutoring_attaqueId_idx" ON "public"."AttaqueTutoring"("attaqueId");

-- CreateIndex
CREATE INDEX "AttaqueTutoring_pokemonGenerationId_idx" ON "public"."AttaqueTutoring"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "Evolution_pokemonId_idx" ON "public"."Evolution"("pokemonId");

-- CreateIndex
CREATE INDEX "Evolution_pokemonGenerationId_idx" ON "public"."Evolution"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "Forme_pokemonGenerationId_idx" ON "public"."Forme"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "Forme_pokemonId_idx" ON "public"."Forme"("pokemonId");

-- CreateIndex
CREATE INDEX "PokemonGenerationHasTalents_pokemonGenerationId_idx" ON "public"."PokemonGenerationHasTalents"("pokemonGenerationId");

-- CreateIndex
CREATE INDEX "PokemonGenerationHasTalents_talentId_idx" ON "public"."PokemonGenerationHasTalents"("talentId");

-- CreateIndex
CREATE INDEX "PokemonGeneration_pokemonId_idx" ON "public"."PokemonGeneration"("pokemonId");

-- CreateIndex
CREATE INDEX "PokemonGeneration_generationId_idx" ON "public"."PokemonGeneration"("generationId");

-- CreateIndex
CREATE INDEX "PokemonGeneration_type1Id_idx" ON "public"."PokemonGeneration"("type1Id");

-- CreateIndex
CREATE INDEX "PokemonGeneration_type2Id_idx" ON "public"."PokemonGeneration"("type2Id");

-- CreateIndex
CREATE INDEX "PokemonGeneration_preEvolutionId_idx" ON "public"."PokemonGeneration"("preEvolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Talent_oldNameId_key" ON "public"."Talent"("oldNameId");

-- CreateIndex
CREATE INDEX "TalentGeneration_talentId_idx" ON "public"."TalentGeneration"("talentId");

-- CreateIndex
CREATE INDEX "TalentGeneration_generationId_idx" ON "public"."TalentGeneration"("generationId");

-- CreateIndex
CREATE INDEX "Type_generationId_idx" ON "public"."Type"("generationId");

-- AddForeignKey
ALTER TABLE "public"."Attaque" ADD CONSTRAINT "Attaque_lastTypeId_fkey" FOREIGN KEY ("lastTypeId") REFERENCES "public"."Type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AttaqueGeneration" ADD CONSTRAINT "AttaqueGeneration_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AttaqueGeneration" ADD CONSTRAINT "AttaqueGeneration_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueGeneration" ADD CONSTRAINT "AttaqueGeneration_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueBreeding" ADD CONSTRAINT "AttaqueBreeding_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueBreeding" ADD CONSTRAINT "AttaqueBreeding_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueCt" ADD CONSTRAINT "AttaqueCt_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueCt" ADD CONSTRAINT "AttaqueCt_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueDt" ADD CONSTRAINT "AttaqueDt_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueDt" ADD CONSTRAINT "AttaqueDt_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueLvl" ADD CONSTRAINT "AttaqueLvl_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueLvl" ADD CONSTRAINT "AttaqueLvl_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueTutoring" ADD CONSTRAINT "AttaqueTutoring_attaqueId_fkey" FOREIGN KEY ("attaqueId") REFERENCES "public"."Attaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttaqueTutoring" ADD CONSTRAINT "AttaqueTutoring_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evolution" ADD CONSTRAINT "Evolution_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Evolution" ADD CONSTRAINT "Evolution_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Forme" ADD CONSTRAINT "Forme_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Forme" ADD CONSTRAINT "Forme_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."PokemonGenerationHasTalents" ADD CONSTRAINT "PokemonGenerationHasTalents_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "public"."PokemonGeneration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."PokemonGenerationHasTalents" ADD CONSTRAINT "PokemonGenerationHasTalents_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Pokemon" ADD CONSTRAINT "Pokemon_firstGenerationId_fkey" FOREIGN KEY ("firstGenerationId") REFERENCES "public"."Generation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pokemon" ADD CONSTRAINT "Pokemon_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonGeneration" ADD CONSTRAINT "PokemonGeneration_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonGeneration" ADD CONSTRAINT "PokemonGeneration_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonGeneration" ADD CONSTRAINT "PokemonGeneration_type1Id_fkey" FOREIGN KEY ("type1Id") REFERENCES "public"."Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonGeneration" ADD CONSTRAINT "PokemonGeneration_type2Id_fkey" FOREIGN KEY ("type2Id") REFERENCES "public"."Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonGeneration" ADD CONSTRAINT "PokemonGeneration_preEvolutionId_fkey" FOREIGN KEY ("preEvolutionId") REFERENCES "public"."Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Talent" ADD CONSTRAINT "Talent_oldNameId_fkey" FOREIGN KEY ("oldNameId") REFERENCES "public"."Talent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TalentGeneration" ADD CONSTRAINT "TalentGeneration_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TalentGeneration" ADD CONSTRAINT "TalentGeneration_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Type" ADD CONSTRAINT "Type_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonHasCompetences" ADD CONSTRAINT "PokemonHasCompetences_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonHasCompetences" ADD CONSTRAINT "PokemonHasCompetences_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "public"."Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
