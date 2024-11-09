import prisma from '../../../../../lib/prisma';
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  
    const id = params.id;
    if (!id) {
        return NextResponse.json(
            { error: 'Talent ID is required' },
            { status: 400 }
        );
    }

    try {
        const talent = await prisma.talents.findUnique({
            where: { id: parseInt(id) },
            include:{
                talents_generations: {
                    include: {
                        generations: true
                    }
                }
            }
        });
          

        if (!talent) {
            return NextResponse.json(
                { error: 'Talent not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { talent },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            // { error: 'Failed to fetch talent' },
            { error: error.message},
            { status: 500 }
        );
    }
}


export async function POST(req, { params }) {
    try {
        const id = params.id;  
        const data = await req.json();

        const { name, old_name, talents_generations } = data.talent;

        if (!id) {
            return NextResponse.json(
                { error: 'Talent ID is required for updating a talent' },
                { status: 400 }
            );
        }

        // Mise à jour du talent
        const updatedTalent = await prisma.talents.update({
            where: { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name }),
                ...(old_name !== undefined && { old_name })
            },
        });

        if(talents_generations){
            const existingTalentsGenerations = await prisma.talents_generations.findMany({
                where: { talent_id: parseInt(id) }
            });
            const idsFromInput = talents_generations.map(tg => tg.id).filter(id => id !== undefined);
            const talentsToDelete = existingTalentsGenerations.filter(existingTg => !idsFromInput.includes(existingTg.id));

            await prisma.talents_generations.deleteMany({
            where: {
                id: { in: talentsToDelete.map(tg => tg.id) }
            }
            });
    
            for (const tg of talents_generations) {
                await prisma.talents_generations.upsert({
                    where: {
                        id: tg.id || 0,
                    },
                    update: {
                        ...(tg.description !== undefined && { description: tg.description }),
                        ...(tg.generation_id !== undefined && { generation_id: tg.generation_id })
                    },
                    create: {
                        talents: {
                            connect: { id: parseInt(id) }
                        },
                        generations: {
                            connect: { id: parseInt(tg.generation_id) }
                        },
                        description: tg.description,
                    },
                });
            }
        }
        

        // Récupérer le talent avec ses relations mises à jour
        const talentWithUpdatedGenerations = await prisma.talents.findUnique({
            where: { id: parseInt(id) },
            include: {
                talents_generations: {
                    include: {
                        generations: true
                    }
                }
            },
        });

        return NextResponse.json(
            { talent: talentWithUpdatedGenerations },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}