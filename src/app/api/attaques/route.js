import prisma from '../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try{
      const attaques = await prisma.attaques.findMany({})
  
      return NextResponse.json(
        { attaques },
        {status: 200});
    }catch(error) {
      return NextResponse.json(
        { error: 'failed to fetch attaques' },
        {status: 500});
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
  
        const { name, attaques_generations } = data.attaque;
  
        if (!name || !attaques_generations) {
            return NextResponse.json(
                { error: 'Name and attaques by generations are required for creating an attaque' },
                { status: 400 }
            );
        }
  
        const newAttaque = await prisma.attaques.create({
            data: {
                name,
                attaques_generations: {
                    create: attaques_generations.map((ag) => ({
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
                    })),
                },
            },
            include:{
              attaques_generations: {
                include: {
                    generations: true,
                    types: true,
                },
              },
            }
        });
  
        return NextResponse.json(
            { talent: newAttaque },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
  }