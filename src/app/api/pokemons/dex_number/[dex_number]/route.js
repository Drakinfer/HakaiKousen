import prisma from '../../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const dexNumber = params.dex_number;

  if (!dexNumber) {
    return NextResponse.json(
      { error: 'Pokemon dexNumber is required' },
      { status: 400 },
    );
  }

  try {
    const pokemon = await prisma.pokemon.findFirst({
      where: { dexNumber: dexNumber },
      include: {
        type: true,
      },
    });

    if (!pokemon) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }

    return NextResponse.json({ pokemon }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
