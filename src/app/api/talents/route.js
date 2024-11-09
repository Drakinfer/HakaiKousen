import prisma from '../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try{
      const talents = await prisma.talents.findMany({})
  
      return NextResponse.json(
        { talents },
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

      const { name, old_name, talents_generations } = data.talent;

      if (!name || !talents_generations) {
          return NextResponse.json(
              { error: 'Name and talents by generation required for creating a talent' },
              { status: 400 }
          );
      }

      const newTalent = await prisma.talents.create({
          data: {
              name,
              old_name: old_name || null,
              talents_generations: {
                  create: talents_generations.map((tg) => ({
                    generations : {
                        connect: { id: parseInt(tg.generation_id) },
                    },
                    description: tg.description,
                  })),
              },
          },
          include:{
            talents_generations: {
              include: {
                  generations: true,
              },
            },
          }
      });

      return NextResponse.json(
          { talent: newTalent },
          { status: 201 }
      );
  } catch (error) {
      return NextResponse.json(
          { error: error.message },
          { status: 500 }
      );
  }
}