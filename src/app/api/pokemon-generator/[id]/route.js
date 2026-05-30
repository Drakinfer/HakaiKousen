import { randomize } from '../../../../../lib/pokemonGenerator';
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req) {
  const body = await req.json();

  const { pokemonGenerationId, levelRange, options } = body;

  const data = { pokemonGenerationId, levelRange, options };

  const pokemonGeneration = await prisma.pokemonGeneration.findUnique({
    where: { id: pokemonGenerationId },
    include: {
      pokemon: true,
      type1: true,
      type2: true,
      attaquesBreeding: { include: { attaque: true } },
      attaquesLvl: { include: { attaque: true } },
      talentsLinks: { include: { talent: true } },
    },
  });

  const generatedPokemon = randomize(data, pokemonGeneration);

  return NextResponse.json(generatedPokemon, { status: 200 });
}
