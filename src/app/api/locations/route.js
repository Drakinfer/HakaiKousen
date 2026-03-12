import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';

export async function GET(req) {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        icon: true,
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

export async function POST(req) {
  try {
    const { ok, res } = await requireApiRole(req, 'EDITOR');
    if (!ok) return res;

    const body = await req.json();
    const { name, icon } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire.' },
        { status: 400 },
      );
    }

    const location = await prisma.location.create({
      data: {
        name: name.trim(),
        icon: icon.trim(),
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'habitat." },
      { status: 500 },
    );
  }
}
