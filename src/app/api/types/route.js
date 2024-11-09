import prisma from '../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try{
      const types = await prisma.types.findMany({
        include:{
            generations: true
        }
      })
  
      return NextResponse.json(
        { types },
        {status: 200});
    }catch(error) {
      return NextResponse.json(
        { error: 'failed to fetch types' },
        {status: 500});
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const {
            name,
            bug,
            dark,
            dragon,
            electric,
            fairy,
            fighting,
            fire,
            flying,
            ghost,
            grass,
            ground,
            ice,
            normal,
            poison,
            psychic,
            rock,
            steel,
            water,
            generation_id
        } = data.type;

        // Validation des données nécessaires
        if (!name || !generation_id) {
            return NextResponse.json(
                { error: 'Name and generation_id are required for creating a type' },
                { status: 400 }
            );
        }

        // Création du type avec les relations vers la génération
        const newType = await prisma.types.create({
            data: {
                name: name,
                bug: bug,
                dark: dark,
                dragon: dragon,
                electric: electric,
                fairy: fairy,
                fighting: fighting,
                fire: fire,
                flying: flying,
                ghost: ghost,
                grass: grass,
                ground: ground,
                ice: ice,
                normal: normal,
                poison: poison,
                psychic: psychic,
                rock: rock,
                steel: steel,
                water: water,
                generations: {
                    connect: { id: parseInt(generation_id) },
                }
            },
        });

        return NextResponse.json(
            { type: newType },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}