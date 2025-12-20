import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const generations = await prisma.generation.findMany();

    return NextResponse.json({ generations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'failed to fetch generation' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const body = await req.json();
    const { name, rank } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Le nom de la génération est requis' },
        { status: 400 },
      );
    }

    console.log(body);
    const parsedRank = Number(rank);
    if (Number.isNaN(parsedRank)) {
      return NextResponse.json(
        { error: 'Le rank doit être un nombre' },
        { status: 400 },
      );
    }

    const generation = await prisma.generation.create({
      data: {
        name,
        rank: parsedRank,
      },
    });

    return NextResponse.json({ generation }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la génération' },
      { status: 500 },
    );
  }
}
