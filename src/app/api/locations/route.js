import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ locations }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des localisations' },
      { status: 500 },
    );
  }
}
