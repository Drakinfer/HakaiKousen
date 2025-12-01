import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { requireApiRole } from '../../../../../lib/apiAuth';

export async function PUT(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const { id } = params;
    const genId = Number(id);

    if (Number.isNaN(genId)) {
      return NextResponse.json(
        { error: "L'identifiant de la génération est invalide" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, rank } = body;

    const data = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string') {
        return NextResponse.json(
          { error: 'Le nom de la génération est invalide' },
          { status: 400 },
        );
      }
      data.name = name;
    }

    if (rank !== undefined) {
      const parsedRank = Number(rank);
      if (Number.isNaN(parsedRank)) {
        return NextResponse.json(
          { error: 'Le rank doit être un nombre' },
          { status: 400 },
        );
      }
      data.rank = parsedRank;
    }

    const generation = await prisma.generation.update({
      where: { id: genId },
      data,
    });

    return NextResponse.json({ generation }, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Génération introuvable' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la génération' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  try {
    const { id } = params;
    const genId = Number(id);

    if (Number.isNaN(genId)) {
      return NextResponse.json(
        { error: "L'identifiant de la génération est invalide" },
        { status: 400 },
      );
    }

    await prisma.generation.delete({
      where: { id: genId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Génération introuvable' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la génération' },
      { status: 500 },
    );
  }
}
