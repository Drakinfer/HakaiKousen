import { getServerSession } from 'next-auth';
import { requireApiRole } from '../../../../lib/apiAuth';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { uploadImageToBlob } from '@/lib/blobUpload';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = (searchParams.get('name') ?? '').trim();
    const firstGenParam = searchParams.get('firstGen');
    const firstGenId = firstGenParam ? Number(firstGenParam) : null;

    const rawTypes = searchParams.get('types')?.split(',') ?? [];
    const searchMode = (searchParams.get('mode') ?? 'any').toLowerCase();

    const typeNames = [
      ...new Set(rawTypes.map((t) => t.trim()).filter(Boolean)),
    ];

    let typeIds = [];
    if (typeNames.length > 0) {
      const types = await prisma.type.findMany({
        where: {
          OR: typeNames.map((n) => ({
            name: { equals: n, mode: 'insensitive' },
          })),
        },
        select: { id: true, name: true },
      });
      typeIds = types.map((t) => t.id);
    }

    let wherePokemon = {};

    if (typeIds.length > 0) {
      if (searchMode === 'exact') {
        if (typeNames.length === 1) {
          const [a] = typeIds;
          wherePokemon = {
            ...wherePokemon,
            pokemonGenerations: {
              some: {
                AND: [{ type1Id: { in: typeIds } }, { type2Id: null }],
              },
            },
          };
        } else {
          const ors = [];
          for (let i = 0; i < typeIds.length; i++) {
            for (let j = i + 1; j < typeIds.length; j++) {
              const a = typeIds[i];
              const b = typeIds[j];
              ors.push({ AND: [{ type1Id: a }, { type2Id: b }] });
              ors.push({ AND: [{ type1Id: b }, { type2Id: a }] });
            }
          }

          wherePokemon = {
            ...wherePokemon,
            pokemonGenerations: {
              some: { OR: ors },
            },
          };
        }
      } else {
        wherePokemon = {
          ...wherePokemon,
          pokemonGenerations: {
            some: {
              OR: [{ type1Id: { in: typeIds } }, { type2Id: { in: typeIds } }],
            },
          },
        };
      }
    }

    if (name) {
      wherePokemon = {
        ...wherePokemon,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }

    if (firstGenId) {
      wherePokemon = {
        ...wherePokemon,
        firstGenerationId: firstGenId,
      };
    }

    const allPokemons = await prisma.pokemon.findMany({
      where: wherePokemon,
    });

    const numeric = [];
    const alnum = [];
    for (const p of allPokemons) {
      if (/^\d+$/.test(p.dexNumber)) numeric.push(p);
      else alnum.push(p);
    }
    numeric.sort((a, b) => Number(a.dexNumber) - Number(b.dexNumber));
    alnum.sort((a, b) =>
      a.dexNumber.localeCompare(b.dexNumber, 'fr', { numeric: true }),
    );
    const sortedPokemons = [...numeric, ...alnum];

    return NextResponse.json(
      { pokemons: sortedPokemons, total: sortedPokemons.length },
      { status: 200 },
    );
  } catch (error) {
    console.error('Erreur Prisma :', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokémon' },
      { status: 500 },
    );
  }
}

function getUserIdOrThrow(req) {
  const userId = req.headers.get('x-user-id');
  const id = userId ? Number(userId) : NaN;
  if (!id || Number.isNaN(id)) {
    throw new Error(
      'Missing user id. Provide x-user-id header or implement session-based auth.',
    );
  }
  return id;
}

function badRequest(message, details = null) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export async function POST(req) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = Number(session.user.id);
  if (Number.isNaN(userId))
    return NextResponse.json(
      { error: 'Invalid session user id' },
      { status: 401 },
    );

  let form;
  try {
    form = await req.formData();
  } catch {
    return badRequest('Invalid multipart form data.');
  }

  const payloadRaw = form.get('payload');
  if (!payloadRaw || typeof payloadRaw !== 'string')
    return badRequest('Missing "payload" in formData.');

  let body;
  try {
    body = JSON.parse(payloadRaw);
  } catch {
    return badRequest('Invalid JSON in "payload".');
  }

  const mainFile = form.get('mainPictureFile');
  const miniFile = form.get('miniPictureFile');

  const {
    pokemon,
    pokemonGenerations = [],
    competences = [],
    locations = [],
  } = body || {};
  if (!pokemon) return badRequest('Missing "pokemon" in payload.');
  if (!pokemon.name || String(pokemon.name).trim() === '')
    return badRequest('Pokemon name is required.');

  for (const f of ['category', 'dexNumber']) {
    if (!pokemon[f] || String(pokemon[f]).trim() === '')
      return badRequest(`Pokemon field "${f}" is required.`);
  }

  let mainPictureUrl = pokemon.mainPicture
    ? String(pokemon.mainPicture).trim()
    : '';
  let miniPictureUrl = pokemon.miniPicture
    ? String(pokemon.miniPicture).trim()
    : '';

  try {
    if (mainFile && typeof mainFile === 'object' && mainFile.name) {
      mainPictureUrl = await uploadImageToBlob(mainFile, 'pokemons/main');
    }
    if (miniFile && typeof miniFile === 'object' && miniFile.name) {
      miniPictureUrl = await uploadImageToBlob(miniFile, 'pokemons/mini');
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'Image upload failed', details: String(e.message || e) },
      { status: 400 },
    );
  }

  if (!mainPictureUrl)
    return badRequest('Pokemon field "mainPicture" is required.');
  if (!miniPictureUrl)
    return badRequest('Pokemon field "miniPicture" is required.');

  try {
    const created = await prisma.$transaction(async (tx) => {
      const createdPokemon = await tx.pokemon.create({
        data: {
          name: String(pokemon.name).trim(),
          category: String(pokemon.category).trim(),
          dexNumber: String(pokemon.dexNumber).trim(),
          mainPicture: mainPictureUrl,
          miniPicture: miniPictureUrl,
          firstGenerationId:
            pokemon.firstGenerationId == null
              ? null
              : Number(pokemon.firstGenerationId),
          typeId: pokemon.typeId == null ? null : Number(pokemon.typeId),
          createdById: userId,
          updatedById: userId,
        },
      });

      const createdPokemonGenerations = [];

      for (const pg of pokemonGenerations) {
        if (!pg?.generationId)
          throw new Error('Each pokemonGeneration must have generationId.');
        if (!pg?.type1Id)
          throw new Error('Each pokemonGeneration must have type1Id.');

        const createdPg = await tx.pokemonGeneration.create({
          data: {
            pokemonId: createdPokemon.id,
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
            preEvolutionWay:
              pg.preEvolutionWay == null ||
              String(pg.preEvolutionWay).trim() === ''
                ? null
                : String(pg.preEvolutionWay).trim(),
            description:
              pg.description == null || String(pg.description).trim() === ''
                ? null
                : String(pg.description).trim(),
          },
        });

        const pgId = createdPg.id;

        if (Array.isArray(pg.talents) && pg.talents.length > 0) {
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
              pokemonId: createdPokemon.id,
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
            pokemonId: createdPokemon.id,
            competenceId: Number(c.competenceId),
            points: c.points == null ? 0 : Number(c.points),
          }));
        if (data.length) await tx.pokemonHasCompetences.createMany({ data });
      }

      if (Array.isArray(locations) && locations.length) {
        const data = locations
          .filter((l) => l?.locationId != null)
          .map((l) => ({
            pokemonId: createdPokemon.id,
            locationId: Number(l.locationId),
          }));
        if (data.length) await tx.pokemonHasLocations.createMany({ data });
      }

      return {
        pokemon: createdPokemon,
        pokemonGenerations: createdPokemonGenerations,
      };
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[POST /api/pokemons] error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create pokemon',
        details: String(error.message || error),
      },
      { status: 500 },
    );
  }
}
