import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { requireApiRole } from '../../../../lib/apiAuth';

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
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const body = await req.json();
    const { name, attaqueGenerations = [] } = body;

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

    const attack = await prisma.attaque.create({
      data: {
        name: name.trim(),
        lastTypeId,
        attaqueGenerations: normalizedGenerations.length
          ? {
              createMany: {
                data: normalizedGenerations,
              },
            }
          : undefined,
      },
      include: {
        lastType: true,
        attaqueGenerations: true,
      },
    });

    return NextResponse.json({ attack }, { status: 201 });
  } catch (err) {
    console.error('Erreur POST /api/attacks', err);
    return NextResponse.json(
      { error: 'Erreur interne serveur.' },
      { status: 500 },
    );
  }
}
