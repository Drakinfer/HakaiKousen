import { requireApiRole } from '../../../../../lib/apiAuth';
import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { error: 'Attaque ID is required' },
      { status: 400 },
    );
  }

  try {
    const attaque = await prisma.attaque.findUnique({
      where: { id: parseInt(id) },
      include: {
        attaqueGenerations: {
          include: {
            generation: true,
            type: true,
          },
        },
      },
    });

    if (!attaque) {
      return NextResponse.json({ error: 'Attaque not found' }, { status: 404 });
    }

    return NextResponse.json({ attaque }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const body = await req.json();
    const { name, attaqueGenerations = [] } = body;
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: "Le nom de l'attaque est obligatoire." },
        { status: 400 },
      );
    }

    const normalizedGenerations = (attaqueGenerations || [])
      .filter((g) => g.generationId && g.typeId)
      .map((g) => ({
        generationId: Number(g.generationId),
        typeId: Number(g.typeId),
        energie1: Number(g.energie1) || 0,
        energie2:
          g.energie2 !== undefined && g.energie2 !== null
            ? Number(g.energie2)
            : null,
        category: g.category,
        range: g.range,
        precision: Number(g.precision) || 0,
        damage_base: Number(g.damage_base) || 0,
        description: g.description?.trim() || '',
      }));

    let lastTypeId = null;
    if (normalizedGenerations.length > 0) {
      const generationIds = [
        ...new Set(normalizedGenerations.map((g) => g.generationId)),
      ];

      const generations = await prisma.generation.findMany({
        where: { id: { in: generationIds } },
        select: { id: true, rank: true },
      });

      if (generations.length > 0) {
        const highestRankGen = generations.reduce((acc, g) =>
          !acc || g.rank > acc.rank ? g : acc,
        );
        const selectedGenData = normalizedGenerations.find(
          (g) => g.generationId === highestRankGen.id,
        );
        if (selectedGenData) {
          lastTypeId = selectedGenData.typeId;
        }
      }
    }

    await prisma.attaqueGeneration.deleteMany({
      where: { attaqueId: id },
    });

    await prisma.attaque.update({
      where: { id },
      data: {
        name: name.trim(),
        lastTypeId,
      },
    });

    if (normalizedGenerations.length > 0) {
      await prisma.attaqueGeneration.createMany({
        data: normalizedGenerations.map((g) => ({
          ...g,
          attaqueId: id,
        })),
      });
    }

    const fullAttack = await prisma.attaque.findUnique({
      where: { id },
      include: {
        lastType: true,
        attaqueGenerations: {
          include: {
            generation: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({ attack: fullAttack }, { status: 200 });
  } catch (err) {
    console.error('Erreur PUT /api/attacks/[id]', err);
    return NextResponse.json(
      { error: 'Erreur interne serveur.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    await prisma.attaqueGeneration.deleteMany({
      where: { attaqueId: id },
    });

    await prisma.attaque.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Attaque supprimée avec succès.' },
      { status: 200 },
    );
  } catch (err) {
    console.error('Erreur DELETE /api/attacks/[id]', err);
    return NextResponse.json(
      { error: "Impossible de supprimer l'attaque." },
      { status: 500 },
    );
  }
}
