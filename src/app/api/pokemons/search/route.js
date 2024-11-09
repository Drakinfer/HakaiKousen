import prisma from '../../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const generationIds = searchParams.getAll('generationId').map(id => parseInt(id));
      const typeIds = searchParams.getAll('typeId').map(id => parseInt(id));
      const attaqueIds = searchParams.getAll('attaqueId').map(id => parseInt(id));

  
      if (generationIds.length === 0 && typeIds.length === 0 && attaqueIds.length === 0) {
        return NextResponse.json(
          { error: 'Invalid or missing parameter' },
          { status: 400 }
        );
      }

      console.log(attaqueIds)
  
      const pokemons = await prisma.pokemons.findMany({
        where: {
          pokemons_generations_pokemons_generations_pokemon_idTopokemons: {
            some: {
              ...(generationIds.length > 0 && { generation_id: { in: generationIds } }),
              ...(typeIds.length > 0 && {
                OR: [
                  { type1: { in: typeIds } },
                  { type2: { in: typeIds } }
                ]
              }),
              AND: [
                {
                  OR: [
                    ...(attaqueIds.length > 0 ? [{
                      attaques_lvl: {
                        some: { attaque_id: { in: attaqueIds } }
                      }
                    }] : []),
                    ...(attaqueIds.length > 0 ? [{
                      attaques_ct: {
                        some: { attaque_id: { in: attaqueIds } }
                      }
                    }] : []),
                    ...(attaqueIds.length > 0 && 'attaques_dt' in prisma.pokemons_generations ? [{
                      attaques_dt: {
                        some: { attaque_id: { in: attaqueIds } }
                      }
                    }] : []),
                    ...(attaqueIds.length > 0 ? [{
                      attaques_breeding: {
                        some: { attaque_id: { in: attaqueIds } }
                      }
                    }] : []),
                    ...(attaqueIds.length > 0 ? [{
                      attaques_tutoring: {
                        some: { attaque_id: { in: attaqueIds } }
                      }
                    }] : [])
                  ]
                }
              ]
            }
          }
        }
      });
  
      return NextResponse.json(
        { pokemons },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }