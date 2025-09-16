import prisma from '../../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  
    const id = params.id;

    if (!id) {
        return NextResponse.json(
            { error: 'Attaque ID is required' },
            { status: 400 }
        );
    }

    try {
        const attaque = await prisma.attaques.findUnique({
            where: { id: parseInt(id) },
            include:{
                attaques_generations: {
                    include: {
                        generations: true,
                        types: true
                    }
                }
            }
        });
          

        if (!attaque) {
            return NextResponse.json(
                { error: 'Attaque not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { attaque },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message},
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const id = params.id;

        const data = await req.json();
  
        const { name, attaques_generations } = data.attaque;
  
        // Validation des données essentielles
        if (!id) {
            return NextResponse.json(
                { error: 'Id is required to updating an attaque' },
                { status: 400 }
            );
        }

        const updatedAttaque = await prisma.attaques.update({
            where: { id: parseInt(id) },
            data: {
                name,
            },
        });


        const existingAttaquesGenerations = await prisma.attaques_generations.findMany({
            where: { attaque_id: parseInt(id) }
        });

        const idsFromInput = attaques_generations.map(ag => ag.id).filter(id => id !== undefined);

        const attaquesToDelete = existingAttaquesGenerations.filter(existingAg => !idsFromInput.includes(existingAg.id));

        await prisma.attaques_generations.deleteMany({
            where: {
                id: { in: attaquesToDelete.map(ag => ag.id) }
            }
        });

        for (const ag of attaques_generations) {
            await prisma.attaques_generations.upsert({
                where: {
                    id: ag.id || 0,
                },
                update: {
                    ...(ag.generation_id !== undefined && { generation_id: ag.generation_id }),
                    ...(ag.type_id !== undefined && { type_id: ag.type_id }),
                    ...(ag.energie1 !== undefined && { energie1: ag.energie1 }),
                    ...(ag.energie2 !== undefined && { energie2: ag.energie2 }),
                    ...(ag.category !== undefined && { category: ag.category }),
                    ...(ag.range !== undefined && { range: ag.range }),
                    ...(ag.precision !== undefined && { precision: ag.precision }),
                    ...(ag.damage_base !== undefined && { damage_base: ag.damage_base }),
                    ...(ag.precision !== undefined && { precision: ag.precision }),
                    ...(ag.description !== undefined && { description: ag.description })
                },
                create: {
                    generations: {
                        connect: { id: parseInt(ag.generation_id) }
                    },
                    types: {
                        connect: { id: parseInt(ag.generation_id) }
                    },
                    energie1: ag.energie1,
                    energie2: ag.energie2,
                    category: ag.category,
                    range: ag.range,
                    precision: ag.precision,
                    damage_base: ag.damage_base,
                    description: ag.description
                },
            });
        }

        const atttaqueWithUpdatedGenerations = await prisma.attaques.findUnique({
            where: { id: parseInt(id) },
            include: {
                attaques_generations: {
                    include: {
                        generations: true,
                        types: true,
                    }
                }
            },
        });
  
        return NextResponse.json(
            { attaque: atttaqueWithUpdatedGenerations },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
  }