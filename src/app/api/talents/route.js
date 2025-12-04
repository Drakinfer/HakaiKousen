import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') ?? '').trim();

    const where = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const talents = await prisma.talent.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ talents }, { status: 200 });
  } catch (error) {
    console.error('Erreur Prisma talents :', error);
    return NextResponse.json(
      { error: 'failed to fetch talents' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, talentGenerations = [] } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Le nom du talent est requis' },
        { status: 400 },
      );
    }

    const talent = await prisma.talent.create({
      data: {
        name,
        talentGenerations: {
          create: talentGenerations.map((tg) => ({
            generationId: tg.generationId,
            description: tg.description,
          })),
        },
      },
      include: {
        talentGenerations: {
          include: {
            generation: true,
          },
        },
      },
    });

    return NextResponse.json({ talent }, { status: 201 });
  } catch (error) {
    console.error('Error creating talent:', error);
    return NextResponse.json(
      { error: 'Failed to create talent' },
      { status: 500 },
    );
  }
}
