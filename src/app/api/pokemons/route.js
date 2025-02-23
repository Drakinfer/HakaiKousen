import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const typeNames = searchParams.get('types')?.split(',') || [];
    const searchMode = searchParams.get('mode') || 'any';

    let typeIds = [];
    if (typeNames.length > 0) {
      const types = await prisma.types.findMany({
        where: {
          name: { in: typeNames },
        },
        select: { id: true },
      });
      typeIds = types.map((type) => type.id);
    }

    let allPokemons;
    if (typeIds.length > 0) {
      if (searchMode === 'exact' && typeNames.length === 2) {
        allPokemons = await prisma.pokemons.findMany({
          where: {
            pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
              some: {
                AND: [{ type1: { in: typeIds } }, { type2: { in: typeIds } }],
              },
            },
          },
        });
      } else {
        allPokemons = await prisma.pokemons.findMany({
          where: {
            pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
              some: {
                OR: [{ type1: { in: typeIds } }, { type2: { in: typeIds } }],
              },
            },
          },
        });
      }
    } else {
      allPokemons = await prisma.pokemons.findMany();
    }

    const total = allPokemons.length;
    const numericPokemons = [];
    const alphanumericPokemons = [];

    allPokemons.forEach((pokemon) => {
      if (/^\d+$/.test(pokemon.dex_number)) {
        numericPokemons.push(pokemon);
      } else {
        alphanumericPokemons.push(pokemon);
      }
    });

    numericPokemons.sort((a, b) => Number(a.dex_number) - Number(b.dex_number));
    alphanumericPokemons.sort((a, b) =>
      a.dex_number.localeCompare(b.dex_number, 'fr', { numeric: true }),
    );

    let sortedPokemons = [...numericPokemons, ...alphanumericPokemons];

    return NextResponse.json(
      { pokemons: sortedPokemons, total },
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

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      name,
      category,
      dex_number,
      main_picture,
      mini_picture,
      first_generation,
      pokemons_generations,
    } = data;

    if (!name || !category || !dex_number || !pokemons_generations) {
      let message = '';

      for (const attr of [
        'name',
        'category',
        'dex_number',
        'pokemons_generations',
      ]) {
        if (eval(attr)) {
          if (message.length > 0) {
            message << ', ';
          }
          message << attr;
        }
      }

      message << ' missing';

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const newPokemon = await prisma.pokemons.create({
      data: {
        name,
        category,
        dex_number,
        main_picture,
        mini_picture,
        first_generation,
        pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
          create: pokemons_generations.map((pg) => ({
            generations: {
              connect: { id: parseInt(pg.generation_id) },
            },
            types_pokemons_generations_type1Totypes: {
              connect: { id: parseInt(pg.type1) },
            },
            types_pokemons_generations_type2Totypes: {
              connect: { id: parseInt(pg.type2) },
            },
            height: pg.height,
            weight: pg.weight,
            breed_rating: pg.breed_rating,
            vita: pg.vita,
            dex: pg.dex,
            for: pg.for,
            conc: pg.conc,
            end: pg.end,
            vol: pg.vol,
            pokemons_pokemons_generations_pre_evolution_idTopokemons: {
              connect: { id: parseInt(pg.pre_evolution_id) },
            },
            pre_evolution_way: pg.pre_evolution_way,
            description: pg.description,
            evolutions: pg.evolutions
              ? {
                  create: pg.evolutions.map((evo) => ({
                    pokemons: {
                      connect: { id: parseInt(evo.pokemon_id) },
                    },
                    evolution_way: evo.evolution_way,
                  })),
                }
              : undefined,
            formes: pg.forms
              ? {
                  create: pg.formes.map((f) => ({
                    pokemons: {
                      connect: { id: parseInt(f.pokemon_id) },
                    },
                    form: f.form,
                  })),
                }
              : undefined,
            pokemon_generations_has_talents: pg.pokemons_generations_has_talents
              ? {
                  create: pg.pokemons_generations_has_talents.map((talent) => ({
                    talents: {
                      connect: { id: parseInt(talent.talent_id) },
                    },
                    hidden: talent.hidden,
                  })),
                }
              : undefined,
            attaques_lvl: pg.attaques_lvl
              ? {
                  create: pg.attaques_lvl.map((att_lvl) => ({
                    attaques: {
                      connect: { id: parseInt(att_lvl.attaque_id) },
                    },
                    learning_way: att_lvl.learning_way,
                  })),
                }
              : undefined,
            attaques_ct: pg.attaques_ct
              ? {
                  create: pg.attaques_ct.map((att_ct) => ({
                    attaques: {
                      connect: { id: parseInt(att_ct.attaque_id) },
                    },
                    number: att_ct.number,
                  })),
                }
              : undefined,
            attaques_dt: pg.attaques_dt
              ? {
                  create: pg.attaques_dt.map((att_dt) => ({
                    attaques: {
                      connect: { id: parseInt(att_dt.attaque_id) },
                    },
                    number: att_dt.number,
                  })),
                }
              : undefined,
            attaques_breeding: pg.attaques_breeding
              ? {
                  create: pg.attaques_breeding.map((att_br) => ({
                    attaques: {
                      connect: { id: parseInt(att_br.attaque_id) },
                    },
                  })),
                }
              : undefined,
            attaques_tutoring: pg.attaques_tutoring
              ? {
                  create: pg.attaques_tutoring.map((att_tuto) => ({
                    attaques: {
                      connect: { id: parseInt(att_tutol.attaque_id) },
                    },
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        generations: true,
        pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
          include: {
            generations: true,
            types_pokemons_generations_type1Totypes: true,
            types_pokemons_generations_type2Totypes: true,
            pokemons_pokemons_generations_pre_evolution_idTopokemons: true,
            attaques_breeding: {
              include: {
                attaques: {
                  include: {
                    attaques_generations: {
                      include: {
                        types: true,
                      },
                    },
                  },
                },
              },
            },
            attaques_ct: {
              include: {
                attaques: {
                  include: {
                    attaques_generations: {
                      include: {
                        types: true,
                      },
                    },
                  },
                },
              },
            },
            attaques_dt: {
              include: {
                attaques: {
                  include: {
                    attaques_generations: {
                      include: {
                        types: true,
                      },
                    },
                  },
                },
              },
            },
            attaques_lvl: {
              include: {
                attaques: {
                  include: {
                    attaques_generations: {
                      include: {
                        types: true,
                      },
                    },
                  },
                },
              },
            },
            attaques_tutoring: {
              include: {
                attaques: {
                  include: {
                    attaques_generations: {
                      include: {
                        types: true,
                      },
                    },
                  },
                },
              },
            },
            evolutions: {
              include: {
                pokemons: true,
              },
            },
            formes: {
              include: {
                pokemons: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ pokemon: newPokemon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
