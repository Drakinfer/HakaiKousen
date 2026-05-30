import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { toFr } from '../../../lib/types';
import { requireApiRole } from '../../../../lib/apiAuth';

export async function GET(req) {
  try {
    const types = await prisma.type.findMany({
      include: {
        generation: true,
      },
      orderBy: { name: 'asc' },
    });

    const payload = types.map((t) => ({
      id: t.id,
      type: t,
      labelFr: toFr(t.name),
    }));

    return NextResponse.json({ types: payload }, { status: 200 });
  } catch (error) {
    console.error('Erreur Prisma :', error);
    return NextResponse.json(
      { error: 'failed to fetch types' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const body = await req.json();

    const { name, generationId, ...multipliers } = body;

    if (!name || !generationId) {
      return NextResponse.json(
        { error: 'Nom et génération obligatoires' },
        { status: 400 },
      );
    }

    const type = await prisma.type.create({
      data: {
        name,
        generationId,
        ...multipliers,
      },
    });

    return NextResponse.json({ type }, { status: 201 });
  } catch (err) {
    console.error('Erreur POST /api/types :', err);
    return NextResponse.json(
      { error: 'Erreur lors de la création du type' },
      { status: 500 },
    );
  }
}
