import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  
    const id = params.id;  // Récupère l'ID depuis l'URL dynamique

    if (!id) {
        return NextResponse.json(
            { error: 'Type ID is required' },
            { status: 400 }
        );
    }

    try {
        // Récupérer le type
        const type = await prisma.types.findUnique({
            where: { id: parseInt(id) },
            include:{
                generations: true
            }
        });
          

        if (!type) {
            return NextResponse.json(
                { error: 'Type not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { type },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            // { error: 'Failed to fetch type' },
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
        if (!id) {
            return NextResponse.json(
                { error: 'ID is required for modifying a type' },
                { status: 400 }
            );
        }

        // Mise à jour du type
        const updatedType = await prisma.types.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(bug && { bug }),
                ...(dark && { dark }),
                ...(dragon && { dragon }),
                ...(electric && { electric }),
                ...(fairy && { fairy }),
                ...(fighting && { fighting }),
                ...(fire && { fire }),
                ...(flying && { flying }),
                ...(ghost && { ghost }),
                ...(grass && { grass }),
                ...(ground && { ground }),
                ...(ice && { ice }),
                ...(normal && { normal }),
                ...(poison && { poison }),
                ...(psychic && { psychic }),
                ...(rock && { rock }),
                ...(steel && { steel }),
                ...(water && { water }),
                ...(generation_id && {generation_id})
            },
        });

        return NextResponse.json(
            { type: updatedType },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}