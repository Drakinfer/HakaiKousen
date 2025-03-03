import prisma from '../../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const dex_number = params.dex_number;

  if (!dex_number) {
    return NextResponse.json(
      { error: 'Pokemon dex_number is required' },
      { status: 400 },
    );
  }

  try {
    const pokemons = await prisma.pokemons.findMany({
      where: { dex_number: dex_number },
    });

    if (!pokemons) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }

    const pokemon = pokemons[0];

    return NextResponse.json({ pokemon }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
