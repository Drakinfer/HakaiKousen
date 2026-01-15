import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(userId);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const generatedPokemons = await prisma.generatedPokemon.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lvl: true,
        sex: true,
        nature: true,
        subNature: true,
        talent: true,
        breedingMove: true,
        shiny: true,
        baron: true,

        stats: true,
      },
    });

    return NextResponse.json({ generatedPokemons }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch generatedPokemons' },
      { status: 500 },
    );
  }
}

function buildPokemonSignature(pokemon) {
  return {
    name: pokemon.name,
    lvl: Number(pokemon.lvl),
    sex: pokemon.sex ?? null,
    nature: pokemon.nature ?? null,
    subNature: pokemon.subNature ?? null,
    talent: pokemon.talent ?? null,
    breedingMove: pokemon.breedingMove ?? null,
    shiny: !!pokemon.shiny,
    baron: !!pokemon.baron,
    stats: pokemon.stats ?? {},
  };
}

function computePokemonHash(pokemon) {
  const signature = buildPokemonSignature(pokemon);
  const json = JSON.stringify(signature);
  return crypto.createHash('sha256').update(json).digest('hex');
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    let pokemon = body.pokemon;

    if (typeof pokemon === 'string') {
      try {
        pokemon = JSON.parse(pokemon);
      } catch (e) {
        console.error('Error parsing pokemon JSON:', e);
      }
    }

    if (!pokemon || !pokemon.name || !pokemon.lvl) {
      return NextResponse.json(
        { error: 'Missing pokemon data' },
        { status: 400 },
      );
    }

    const userId = Number(session.user.id);

    const hash = computePokemonHash(pokemon);

    const existing = await prisma.GeneratedPokemon.findFirst({
      where: {
        userId,
        hash,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          alreadyExists: true,
          pokemon: existing,
        },
        { status: 200 },
      );
    }

    const created = await prisma.generatedPokemon.create({
      data: {
        userId,
        name: pokemon.name,
        lvl: Number(pokemon.lvl),
        sex: pokemon.sex ?? null,
        nature: pokemon.nature ?? null,
        subNature: pokemon.subNature ?? null,
        talent: pokemon.talent ?? null,
        breedingMove: pokemon.breedingMove ?? null,
        shiny: !!pokemon.shiny,
        baron: !!pokemon.baron,
        stats: pokemon.stats ?? {},
        hash,
      },
    });

    return NextResponse.json(
      {
        alreadyExists: false,
        pokemon: created,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('Error saving generated pokemon:', err);
    return NextResponse.json(
      { error: 'Error saving generated pokemon' },
      { status: 500 },
    );
  }
}
