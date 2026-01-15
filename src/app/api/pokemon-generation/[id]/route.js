import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(_req, { params }) {
  try {
    const id = Number(params?.id);

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant du PokémonGeneration est requis." },
        { status: 400 },
      );
    }

    const pg = await prisma.pokemonGeneration.findUnique({
      where: { id },
      include: {
        pokemon: true,
        type1: true,
        type2: true,
        attaquesBreeding: { include: { attaque: true } },
        attaquesLvl: { include: { attaque: true } },
        talentsLinks: { include: { talent: true } },
      },
    });

    if (!pg) {
      return NextResponse.json(
        { error: 'Aucun PokémonGeneration trouvé pour cet identifiant.' },
        { status: 404 },
      );
    }

    const payload = {
      pokemonGeneration: {
        id: pg.id,
        pokemonId: pg.pokemonId,
        generationId: pg.generationId,
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
        pokemon: {
          id: pg.pokemon.id,
          name: pg.pokemon.name,
          category: pg.pokemon.category,
          dexNumber: pg.pokemon.dexNumber,
          mainPicture: pg.pokemon.mainPicture,
          miniPicture: pg.pokemon.miniPicture,
        },
      },
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error('[GET /api/pokemon-generations/:id] Erreur :', err);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du PokémonGeneration.' },
      { status: 500 },
    );
  }
}
