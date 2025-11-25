import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = (searchParams.get('name') ?? '').trim();
    const typeNameParam = searchParams.get('typeName');
    const typeName = typeNameParam ? String(typeNameParam) : null;

    const where = {};

    let typeIds = [];

    if (typeName) {
      const types = await prisma.type.findMany({
        where: {
          name: { equals: typeName, mode: 'insensitive' },
        },
        select: { id: true, name: true },
      });

      typeIds = types.map((t) => t.id);
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (Array.isArray(typeIds) && typeIds.length > 0) {
      where.lastTypeId = {
        in: typeIds,
      };
    }

    const attaques = await prisma.attaque.findMany({
      where,
      include: {
        lastType: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ attacks: attaques }, { status: 200 });
  } catch (error) {
    console.error('Erreur Prisma attaques :', error);
    return NextResponse.json(
      { error: 'failed to fetch attaques' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const { name, attaques_generations } = data.attaque;

    if (!name || !attaques_generations) {
      return NextResponse.json(
        {
          error:
            'Name and attaques by generations are required for creating an attaque',
        },
        { status: 400 },
      );
    }

    const newAttaque = await prisma.attaques.create({
      data: {
        name,
        attaques_generations: {
          create: attaques_generations.map((ag) => ({
            generations: {
              connect: { id: parseInt(ag.generation_id) },
            },
            types: {
              connect: { id: parseInt(ag.generation_id) },
            },
            energie1: ag.energie1,
            energie2: ag.energie2,
            category: ag.category,
            range: ag.range,
            precision: ag.precision,
            damage_base: ag.damage_base,
            description: ag.description,
          })),
        },
      },
      include: {
        attaques_generations: {
          include: {
            generations: true,
            types: true,
          },
        },
      },
    });

    return NextResponse.json({ attack: newAttaque }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
