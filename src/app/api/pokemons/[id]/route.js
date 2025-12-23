import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { requireApiRole } from '../../../../../lib/apiAuth';

export async function GET(_req, { params }) {
  const id = Number(params?.id);
  if (!id) {
    return NextResponse.json(
      { error: 'Pokemon ID is required' },
      { status: 400 },
    );
  }

  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id },
      include: {
        firstGeneration: true,
        type: true,
        pokemonHasCompetences: {
          include: {
            competence: true,
          },
        },
        pokemonHasLocations: {
          include: {
            location: true,
          },
        },

        pokemonGenerations: {
          orderBy: { generation: { rank: 'desc' } },
          include: {
            generation: true,
            type1: true,
            type2: true,
            preEvolution: true,
            evolutions: {
              include: {
                pokemon: {
                  include: { type: true },
                },
              },
            },
            formes: {
              include: {
                pokemon: {
                  include: { type: true },
                },
              },
            },
            talentsLinks: {
              include: {
                talent: {
                  include: {
                    talentGenerations: {
                      include: {
                        generation: true,
                      },
                    },
                  },
                },
              },
            },
            attaquesLvl: {
              include: {
                attaque: {
                  include: {
                    attaqueGenerations: {
                      include: { type: true, generation: true },
                    },
                  },
                },
              },
            },
            attaquesCt: {
              include: {
                attaque: {
                  include: {
                    attaqueGenerations: {
                      include: { type: true, generation: true },
                    },
                  },
                },
              },
            },
            attaquesDt: {
              include: {
                attaque: {
                  include: {
                    attaqueGenerations: {
                      include: { type: true, generation: true },
                    },
                  },
                },
              },
            },
            attaquesBreeding: {
              include: {
                attaque: {
                  include: {
                    attaqueGenerations: {
                      include: { type: true, generation: true },
                    },
                  },
                },
              },
            },
            attaquesTutoring: {
              include: {
                attaque: {
                  include: {
                    attaqueGenerations: {
                      include: { type: true, generation: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!pokemon) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }

    return NextResponse.json({ pokemon }, { status: 200 });
  } catch (error) {
    console.error('GET /pokemons/[id] error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

function badRequest(message, details = null) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

function buildPokemonUpdateData(pokemon, userId) {
  const data = {
    name: String(pokemon.name ?? '').trim(),
    category: String(pokemon.category ?? '').trim(),
    dexNumber: String(pokemon.dexNumber ?? '').trim(),
    mainPicture: String(pokemon.mainPicture ?? '').trim(),
    miniPicture: String(pokemon.miniPicture ?? '').trim(),
    updatedBy: { connect: { id: userId } },
    updatedAt: new Date(),
  };

  if (pokemon.firstGenerationId == null || pokemon.firstGenerationId === '') {
    data.firstGeneration = { disconnect: true };
  } else {
    data.firstGeneration = {
      connect: { id: Number(pokemon.firstGenerationId) },
    };
  }

  if (pokemon.typeId == null || pokemon.typeId === '') {
    data.type = { disconnect: true };
  } else {
    data.type = { connect: { id: Number(pokemon.typeId) } };
  }

  return data;
}

export async function PUT(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  const pokemonId = Number(params.id);
  if (Number.isNaN(pokemonId)) return badRequest('Invalid pokemon id');

  let body;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    pokemon,
    pokemonGenerations = [],
    competences = [],
    locations = [],
  } = body || {};

  if (!pokemon) return badRequest('Missing "pokemon" in body');

  if (!pokemon.name) return badRequest('Pokemon.name is required');
  if (!pokemon.category) return badRequest('Pokemon.category is required');
  if (!pokemon.dexNumber) return badRequest('Pokemon.dexNumber is required');
  if (!pokemon.mainPicture)
    return badRequest('Pokemon.mainPicture is required');
  if (!pokemon.miniPicture)
    return badRequest('Pokemon.miniPicture is required');

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.pokemon.findUnique({
        where: { id: pokemonId },
        select: { id: true },
      });
      if (!existing) {
        return { notFound: true };
      }

      const updatedPokemon = await tx.pokemon.update({
        where: { id: pokemonId },
        data: buildPokemonUpdateData(pokemon, user.id),
      });

      const existingPGs = await tx.pokemonGeneration.findMany({
        where: { pokemonId },
        select: { id: true },
      });
      const pgIds = existingPGs.map((x) => x.id);

      if (pgIds.length > 0) {
        await tx.attaqueBreeding.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueCt.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueDt.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueLvl.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueTutoring.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.pokemonGenerationHasTalents.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.evolution.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.forme.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.pokemonGeneration.deleteMany({ where: { id: { in: pgIds } } });
      }

      await tx.pokemonHasCompetences.deleteMany({ where: { pokemonId } });
      await tx.pokemonHasLocations.deleteMany({ where: { pokemonId } });

      const createdPokemonGenerations = [];

      for (const pg of pokemonGenerations) {
        if (!pg?.generationId)
          throw new Error('Each pokemonGeneration must have generationId');
        if (!pg?.type1Id)
          throw new Error('Each pokemonGeneration must have type1Id');

        const createdPg = await tx.pokemonGeneration.create({
          data: {
            pokemonId,
            generationId: Number(pg.generationId),
            type1Id: Number(pg.type1Id),
            type2Id:
              pg.type2Id == null || pg.type2Id === ''
                ? null
                : Number(pg.type2Id),

            height: pg.height == null ? 0 : Number(pg.height),
            weight: pg.weight == null ? 0 : Number(pg.weight),
            breedRating: pg.breedRating || 'MALE',

            vita: pg.vita == null ? 0 : Number(pg.vita),
            dex: pg.dex == null ? 0 : Number(pg.dex),
            for: pg.for == null ? 0 : Number(pg.for),
            conc: pg.conc == null ? 0 : Number(pg.conc),
            end: pg.end == null ? 0 : Number(pg.end),
            vol: pg.vol == null ? 0 : Number(pg.vol),

            preEvolutionId:
              pg.preEvolutionId == null || pg.preEvolutionId === ''
                ? null
                : Number(pg.preEvolutionId),
            preEvolutionWay: pg.preEvolutionWay
              ? String(pg.preEvolutionWay).trim()
              : null,
            description: pg.description ? String(pg.description).trim() : null,
          },
        });

        const pgId = createdPg.id;

        if (Array.isArray(pg.talents) && pg.talents.length) {
          const data = pg.talents
            .filter((t) => t?.talentId)
            .map((t) => ({
              pokemonGenerationId: pgId,
              talentId: Number(t.talentId),
              hidden: Boolean(t.hidden),
            }));
          if (data.length)
            await tx.pokemonGenerationHasTalents.createMany({ data });
        }

        const attaques = pg.attaques || {};

        if (Array.isArray(attaques.breeding) && attaques.breeding.length) {
          const data = attaques.breeding
            .filter((a) => a?.attaqueId)
            .map((a) => ({
              pokemonGenerationId: pgId,
              attaqueId: Number(a.attaqueId),
            }));
          if (data.length) await tx.attaqueBreeding.createMany({ data });
        }

        if (Array.isArray(attaques.ct) && attaques.ct.length) {
          const data = attaques.ct
            .filter((a) => a?.attaqueId != null && a?.number != null)
            .map((a) => ({
              pokemonGenerationId: pgId,
              attaqueId: Number(a.attaqueId),
              number: Number(a.number),
            }));
          if (data.length) await tx.attaqueCt.createMany({ data });
        }

        if (Array.isArray(attaques.dt) && attaques.dt.length) {
          const data = attaques.dt
            .filter((a) => a?.attaqueId != null && a?.number != null)
            .map((a) => ({
              pokemonGenerationId: pgId,
              attaqueId: Number(a.attaqueId),
              number: Number(a.number),
            }));
          if (data.length) await tx.attaqueDt.createMany({ data });
        }

        if (Array.isArray(attaques.lvl) && attaques.lvl.length) {
          const data = attaques.lvl
            .filter((a) => a?.attaqueId != null && a?.learningWay)
            .map((a) => ({
              pokemonGenerationId: pgId,
              attaqueId: Number(a.attaqueId),
              learningWay: String(a.learningWay).trim(),
            }));
          if (data.length) await tx.attaqueLvl.createMany({ data });
        }

        if (Array.isArray(attaques.tutoring) && attaques.tutoring.length) {
          const data = attaques.tutoring
            .filter((a) => a?.attaqueId)
            .map((a) => ({
              pokemonGenerationId: pgId,
              attaqueId: Number(a.attaqueId),
            }));
          if (data.length) await tx.attaqueTutoring.createMany({ data });
        }

        if (Array.isArray(pg.evolutions) && pg.evolutions.length) {
          const data = pg.evolutions
            .filter((e) => e?.pokemonId && e?.evolutionWay)
            .map((e) => ({
              pokemonGenerationId: pgId,
              pokemonId: Number(e.pokemonId),
              evolutionWay: String(e.evolutionWay).trim(),
            }));
          if (data.length) await tx.evolution.createMany({ data });
        }

        if (Array.isArray(pg.formes) && pg.formes.length) {
          const data = pg.formes
            .filter((f) => f?.form)
            .map((f) => ({
              pokemonGenerationId: pgId,
              pokemonId,
              form: String(f.form).trim(),
            }));
          if (data.length) await tx.forme.createMany({ data });
        }

        createdPokemonGenerations.push(createdPg);
      }

      if (Array.isArray(competences) && competences.length) {
        const data = competences
          .filter((c) => c?.competenceId != null)
          .map((c) => ({
            pokemonId,
            competenceId: Number(c.competenceId),
            points: c.points == null ? 0 : Number(c.points),
          }));
        if (data.length) await tx.pokemonHasCompetences.createMany({ data });
      }

      if (Array.isArray(locations) && locations.length) {
        const data = locations
          .filter((l) => l?.locationId != null)
          .map((l) => ({
            pokemonId,
            locationId: Number(l.locationId),
          }));
        if (data.length) await tx.pokemonHasLocations.createMany({ data });
      }

      return {
        pokemon: updatedPokemon,
        pokemonGenerations: createdPokemonGenerations,
      };
    });

    if (result?.notFound) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/pokemons/[id]] error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update pokemon',
        details: String(error.message || error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const pokemonId = Number(params.id);
  if (Number.isNaN(pokemonId)) return badRequest('Invalid pokemon id');

  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const existing = await tx.pokemon.findUnique({
        where: { id: pokemonId },
        select: { id: true },
      });
      if (!existing) return { notFound: true };

      const pgs = await tx.pokemonGeneration.findMany({
        where: { pokemonId },
        select: { id: true },
      });
      const pgIds = pgs.map((x) => x.id);

      if (pgIds.length > 0) {
        await tx.attaqueBreeding.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueCt.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueDt.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueLvl.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.attaqueTutoring.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.pokemonGenerationHasTalents.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.evolution.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });
        await tx.forme.deleteMany({
          where: { pokemonGenerationId: { in: pgIds } },
        });

        await tx.pokemonGeneration.deleteMany({ where: { id: { in: pgIds } } });
      }

      await tx.pokemonHasCompetences.deleteMany({ where: { pokemonId } });
      await tx.pokemonHasLocations.deleteMany({ where: { pokemonId } });

      await tx.pokemon.delete({ where: { id: pokemonId } });

      return { ok: true };
    });

    if (deleted?.notFound) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/pokemons/[id]] error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete pokemon',
        details: String(error.message || error),
      },
      { status: 500 },
    );
  }
}
