import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
  
    const id = params.id;  // Récupère l'ID depuis l'URL dynamique

    if (!id) {
        return NextResponse.json(
            { error: 'Pokemon ID is required' },
            { status: 400 }
        );
    }

    try {
        // Récupérer le Pokémon avec toutes les relations
        const pokemon = await prisma.pokemons.findUnique({
            where: { id: parseInt(id) },
            include: {
                generations : true,
                pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
                    include: {
                        generations: true,
                        types_pokemons_generations_type1Totypes: true,
                        types_pokemons_generations_type2Totypes: true,
                        evolutions: {
                            include:{
                                pokemons: true
                            }
                        },
                        formes: {
                            include:{
                                pokemons: true
                            }
                        },
                        pokemon_generations_has_talents: {
                            include: {
                                talents: true,
                            },
                        },
                        attaques_lvl: {
                            include: {
                                attaques: {
                                    include: {
                                        attaques_generations: true,
                                    }
                                }
                            },
                        },
                        attaques_ct: {
                            include: {
                                attaques: {
                                    include: {
                                        attaques_generations: true,
                                    }
                                }
                            },
                        },
                        attaques_dt: {
                            include: {
                                attaques: {
                                    include: {
                                        attaques_generations: true,
                                    }
                                }
                            },
                        },
                        attaques_breeding:{
                            include: {
                                attaques: {
                                    include: {
                                        attaques_generations: true,
                                    }
                                }
                            },
                        },
                        attaques_tutoring: {
                            include: {
                                attaques: {
                                    include: {
                                        attaques_generations: true,
                                    }
                                }
                            },
                        },
                    },
                },
            },
        });
          

        if (!pokemon) {
            return NextResponse.json(
                { error: 'Pokemon not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { pokemon },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            // { error: 'Failed to fetch pokemon' },
            { error: error.message},
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const id = params.id;  // Récupère l'ID depuis l'URL dynamique

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
  
        // Validation des données essentielles
        if (!id) {
            return NextResponse.json(
                { error: 'Id is required for creating an attaque' },
                { status: 400 }
            );
        }

        const updatedPokemon = await prisma.pokemons.update({
            where: { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name: name }),
                ...(category !== undefined && { category: category }),
                ...(dex_number !== undefined && { dex_number: dex_number }),
                ...(main_picture !== undefined && { main_picture: main_picture }),
                ...(mini_picture !== undefined && { mini_picture: mini_picture }),
                ...(first_generation !== undefined && { first_generation: first_generation }),
            },
        });
        if (pokemons_generations){
            for (const pg of pokemons_generations) {
                const existingPokemonsGenerations = await prisma.pokemons_generations.findMany({
                    where: { pokemon_id: parseInt(id) }
                });

                const idsFromInput = pg.map(p => p.id).filter(id => id !== undefined);

                const pokemonsToDelete = existingPokemonsGenerations.filter(existingPg => !idsFromInput.includes(existingPg.id));

                await prisma.pokemons_generations.deleteMany({
                    where: {
                        id: { in: pokemonsToDelete.map(p => p.id) }
                    }
                });


                await prisma.pokemons_generations.upsert({
                    where: {
                        id: pg.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                    },
                    update: {
                        ...(pg.generation_id !== undefined && { generation_id: pg.generation_id }),
                        ...(pg.type1 !== undefined && { type1: pg.type1 }),
                        ...(pg. type2 !== undefined && {  type2: pg. type2 }),
                        ...(pg.height !== undefined && { height: pg.height }),
                        ...(pg.weight !== undefined && { weight: pg.weight }),
                        ...(pg.breed_rating !== undefined && { breed_rating: pg.breed_rating }),
                        ...(pg.vita !== undefined && { vita: pg.vita }),
                        ...(pg.dex !== undefined && { dex: pg.dex }),
                        ...(pg.for !== undefined && { for: pg.for }),
                        ...(pg.conc !== undefined && { conc: pg.conc }),
                        ...(pg.end !== undefined && { end: pg.end }),
                        ...(pg.vol !== undefined && { vol: pg.vol }),
                        ...(pg.pre_evolution_id !== undefined && { pre_evolution_id: pg.pre_evolution_id }),
                        ...(pg.pre_evolution_way !== undefined && { pre_evolution_way: pg.pre_evolution_way }),
                        ...(pg.description !== undefined && { description: pg.description })
                    },
                    create: {
                        generation_id: pg.generation_id,
                        type1: pg.type1,
                        type2: pg.type2,
                        height: pg.height,
                        weight: pg.weight,
                        breed_rating: pg.breed_rating,
                        vita: pg.vita,
                        dex: pg.dex,
                        for: pg.for,
                        conc: pg.conc,
                        end: pg.end,
                        vol: pg.vol,
                        pre_evolution_id: pg.pre_evolution_id,
                        pre_evolution_way: pg.pre_evolution_way,
                        description: pg.description,
                    }
                })

                if(pg.evolutions){
                    const existingEvolutions = await prisma.evolutions.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.evolutions.map(evo =>evo.id).filter(id => id !== undefined);
    
                    const evolutionsToDelete = existingEvolutions.filter(existingEvo => !idsFromInput.includes(existingEvo.id));
    
                    await prisma.evolutions.deleteMany({
                        where: {
                            id: { in: evolutionsToDelete.map(evo => evo.id) }
                        }
                    });

                    for (const evo in pg.evolutions) {
                        await prisma.evolutions.upsert({
                            where: {
                                id: evo.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(evo.pokemon_id !== undefined && { pokemon_id: evo.pokemon_id }),
                                ...(evo.evolution_way !== undefined && { evolution_way: evo.evolution_way })
                            },
                            create: {
                                pokemon_id: evo.pokemon_id,
                                evolution_way: evo.evolution_way
                            }
                        })
                    }
                }
    
                if(pg.forms){
                    const existingForms = await prisma.formes.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.forms.map(f => f.id).filter(id => id !== undefined);
    
                    const formsToDelete = existingForms.filter(existingForm => !idsFromInput.includes(existingForm.id));
    
                    await prisma.formes.deleteMany({
                        where: {
                            id: { in: formsToDelete.map(f => f.id) }
                        }
                    });

                    for (const f in pg.forms) {
                        await prisma.formes.upsert({
                            where: {
                                id: f.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(f.pokemon_id !== undefined && { pokemon_id: f.pokemon_id }),
                                ...(f.form !== undefined && { form: f.form })
                            },
                            create: {
                                pokemon_id: f.pokemon_id,
                                form: f.form
                            }
                        })
                    }
                }
    
                if(pg.talents){
                    const existingPokemonTalents = await prisma.pokemons_generations_has_talents.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.pokemon_generations_has_talents.map(pght =>pght.id).filter(id => id !== undefined);
    
                    const PGHTToDelete = existingPokemonTalents.filter(existingPGHT => !idsFromInput.includes(existingPGHT.id));
    
                    await prisma.pokemon_generations_has_talents.deleteMany({
                        where: {
                            id: { in: PGHTToDelete.map(evo => evo.id) }
                        }
                    });

                    for (const talent in pg.pokemon_generations_has_talents) {
                        await prisma.pokemon_generations_has_talents.upsert({
                            where: {
                                id: talent.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(talent.talent_id !== undefined && { talent_id: talent.talent_id }),
                                ...(talent.hidden !== undefined && { hidden: talent.hidden })
                            },
                            create: {
                                talent_id: talent.talent_id,
                                hidden: talent.hidden
                            }
                        })
                    }
                }
    
                if(pg.attaques_lvl){
                    const existingAttaquesLvl = await prisma.attaques_lvl.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.attaques_lvl.map(att_lvl => att_lvl.id).filter(id => id !== undefined);
    
                    const attaquesLvlToDelete = existingAttaquesLvl.filter(existingAttLvl => !idsFromInput.includes(existingAttLvl.id));
    
                    await prisma.attaques_lvl.deleteMany({
                        where: {
                            id: { in: attaquesLvlToDelete.map(att_lvl => att_lvl.id) }
                        }
                    });

                    for (const att_lvl in pg.attaques_lvl) {
                        await prisma.attaques_lvl.upsert({
                            where: {
                                id: att_lvl.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(att_lvl.attaque_id !== undefined && { attaque_id: att_lvl.attaque_id }),
                                ...(att_lvl.learning_way !== undefined && { learning_way: att_lvl.learning_way })
                            },
                            create: {
                                attaque_id: att_lvl.attaque_id,
                                learning_way: att_lvl.learning_way
                            }
                        })
                    }
                }
    
                if(pg.attaques_ct){
                    const existingAttaquesCt = await prisma.attaques_ct.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.attaques_ct.map(att_ct => att_ct.id).filter(id => id !== undefined);
    
                    const attaquesCtToDelete = existingAttaquesCt.filter(existingAttCt => !idsFromInput.includes(existingAttCt.id));
    
                    await prisma.attaques_ct.deleteMany({
                        where: {
                            id: { in: attaquesCtToDelete.map(att_ct => att_ct.id) }
                        }
                    });

                    for (const att_ct in pg.attaques_ct) {
                        await prisma.attaques_ct.upsert({
                            where: {
                                id: att_ct.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(att_ct.attaque_id !== undefined && { attaque_id: att_ct.attaque_id }),
                                ...(att_ct.number !== undefined && { number: att_ct.number })
                            },
                            create: {
                                attaque_id: att_ct.attaque_id,
                                number: att_ct.number
                            }
                        })
                    }
                }
    
                if(pg.attaques_dt){
                    const existingAttaquesDT = await prisma.attaques_dt.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.attaques_dt.map(att_dt => att_dt.id).filter(id => id !== undefined);
    
                    const attaquesDtToDelete = existingAttaquesDt.filter(existingAttDt => !idsFromInput.includes(existingAttDt.id));
    
                    await prisma.attaques_dt.deleteMany({
                        where: {
                            id: { in: attaquesDtToDelete.map(att_dt => att_dt.id) }
                        }
                    });

                    for (const att_dt in pg.attaques_dt) {
                        await prisma.attaques_dt.upsert({
                            where: {
                                id: att_dt.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(att_dt.attaque_id !== undefined && { attaque_id: att_dt.attaque_id }),
                                ...(att_dt.number !== undefined && { number: att_dt.number })
                            },
                            create: {
                                attaque_id: att_dt.attaque_id,
                                number: att_dt.number
                            }
                        })
                    }
                }
    
                if(pg.attaques_breeding){
                    const existingAttaquesBreeding = await prisma.attaques_breeding.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.attaques_breeding.map(att_breed => att_breed.id).filter(id => id !== undefined);
    
                    const attaquesBreedingToDelete = existingAttaquesBreeding.filter(existingAttBreed => !idsFromInput.includes(existingAttBreed.id));
    
                    await prisma.attaques_breeding.deleteMany({
                        where: {
                            id: { in: attaquesBreedingToDelete.map(att_breed => att_breed.id) }
                        }
                    });

                    for (const att_breed in pg.attaques_breeding) {
                        await prisma.attaques_breed.upsert({
                            where: {
                                id: att_breed.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(att_breed.attaque_id !== undefined && { attaque_id: att_breed.attaque_id }),
                            },
                            create: {
                                attaque_id: att_breed.attaque_id,
                            }
                        })
                    }
                }
    
                if(pg.attaques_tutoring){
                    const existingAttaquesTutoring = await prisma.attaques_tutoring.findMany({
                        where: { pokemon_generation_id: parseInt(pg.id) }
                    });
    
                    const idsFromInput = pg.attaques_tutoring.map(att_tuto => att_tuto.id).filter(id => id !== undefined);
    
                    const attaquesTutoToDelete = existingAttaquesTutoring.filter(existingAttTuto => !idsFromInput.includes(existingAttTuto.id));
    
                    await prisma.attaques_tutoring.deleteMany({
                        where: {
                            id: { in: attaquesTutoToDelete.map(att_tuto => att_tuto.id) }
                        }
                    });

                    for (const att_tuto in pg.attaques_tutoring) {
                        await prisma.attaques_tutoring.upsert({
                            where: {
                                id: att_tuto.id || 0, // `id` est utilisé pour vérifier l'existence de l'enregistrement
                            },
                            update: {
                                ...(att_tuto.attaque_id !== undefined && { attaque_id: att_tuto.attaque_id }),
                            },
                            create: {
                                attaque_id: att_tuto.attaque_id,
                            }
                        })
                    }
                }
            }
        }
        
        const pokemon = await prisma.pokemons.findUnique({
            where: { id: parseInt(id) },
            include: {
                generations: true,
                pokemons_generations_pokemons_generations_pokemon_idTopokemons   : {
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
                              types: true
                            }
                          }
                        }
                      }
                    }
                  },
                  attaques_ct: {
                    include: {
                      attaques: {
                        include: {
                          attaques_generations: {
                            include: {
                              types: true
                            }
                          }
                        }
                      }
                    }
                  },
                  attaques_dt: {
                    include: {
                      attaques: {
                        include: {
                          attaques_generations: {
                            include: {
                              types: true
                            }
                          }
                        }
                      }
                    }
                  },
                  attaques_lvl: {
                    include: {
                      attaques: {
                        include: {
                          attaques_generations: {
                            include: {
                              types: true
                            }
                          }
                        }
                      }
                    }
                  },
                  attaques_tutoring: {
                    include: {
                      attaques: {
                        include: {
                          attaques_generations: {
                            include: {
                              types: true
                            }
                          }
                        }
                      }
                    }
                  },
                  evolutions: {
                    include: {
                        pokemons: true,
                    }
                  },
                  formes: {
                    include: {
                      pokemons: true,
                    }
                  }
                }
              }
            }
        });
  
        return NextResponse.json(
            { attaque: pokemon },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
  }