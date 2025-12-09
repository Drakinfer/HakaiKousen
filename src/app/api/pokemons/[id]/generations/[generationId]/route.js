import prisma from '../../../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req, { params }) {
  try {
    const pokemonId = Number(params?.id);
    const generationId = Number(params?.generationId);

    if (!pokemonId || !generationId) {
      return NextResponse.json(
        { error: 'pokemonId et generationId are required' },
        { status: 400 },
      );
    }

    const pg = await prisma.pokemonGeneration.findFirst({
      where: { pokemonId, generationId },
      include: {
        pokemon: true,
        generation: true,
        type1: true,
        type2: true,
        attaquesBreeding: { include: { attaque: true } },
        attaquesLvl: { include: { attaque: true } },
        talentsLinks: { include: { talent: true } },
      },
    });

    if (!pg) {
      return NextResponse.json(
        {
          error:
            'Aucune entrée PokemonGeneration trouvée pour ces identifiants.',
        },
        { status: 404 },
      );
    }

    const payload = {
      pokemon: {
        id: pg.pokemon.id,
        name: pg.pokemon.name,
        mainPicture: pg.pokemon.mainPicture,
      },
      pokemonGeneration: {
        id: pg.id,
        pokemonId: pg.pokemon.id,
        generationId: pg.generation.id,
        height: pg.height,
        weight: pg.weight,
        breedRating: pg.breedRating,
        stats: {
          vita: pg.vita,
          dex: pg.dex,
          for: pg.for,
          conc: pg.conc,
          end: pg.end,
          vol: pg.vol,
        },
        types: {
          type1: pg.type1,
          type2: pg.type2,
        },
        attaques: {
          breeding: pg.attaquesBreeding,
          lvl: pg.attaquesLvl,
        },
        talentsLinks: pg.talentsLinks,
      },
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error(
      '[GET /api/pokemons/:pokemonId/generations/:generationId] error:',
      err,
    );
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du PokemonGeneration.' },
      { status: 500 },
    );
  }
}
