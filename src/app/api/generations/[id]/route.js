import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
  
    const id = params.id;  // Récupère l'ID depuis l'URL dynamique

    if (!id) {
        return NextResponse.json(
            { error: 'Generation ID is required' },
            { status: 400 }
        );
    }

    try {
        // Récupérer le Pokémon avec toutes les relations
        const generation = await prisma.generations.findUnique({
            where: { id: parseInt(id) },
        });
          

        if (!generation) {
            return NextResponse.json(
                { error: 'Generation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { generation },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            // { error: 'Failed to fetch generation' },
            { error: error.message},
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const data = await req.json();

        const id = params.id;

        const { name, rank } = data.generation;

        if (!id) {
            return NextResponse.json(
                { error: 'Generation ID is required' },
                { status: 400 }
            );
        }

        const updatedGeneration = await prisma.generations.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(rank && { rank }),
            },
        });

        return NextResponse.json(
            { generation: updatedGeneration },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
