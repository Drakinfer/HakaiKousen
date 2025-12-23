import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';

export async function GET(req) {
  try {
    const competences = await prisma.competence.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json({ competences }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des compétences' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const { ok, res } = await requireApiRole(req, 'EDITOR');
    if (!ok) return res;

    const body = await req.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire.' },
        { status: 400 },
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'La description est obligatoire.' },
        { status: 400 },
      );
    }

    const competence = await prisma.competence.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json(competence, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compétence.' },
      { status: 500 },
    );
  }
}
