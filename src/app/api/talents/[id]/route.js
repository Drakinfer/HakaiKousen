import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json(
      { error: 'Talent ID is required' },
      { status: 400 },
    );
  }

  try {
    const talent = await prisma.talent.findUnique({
      where: { id: parseInt(id) },
      include: {
        talentGenerations: {
          include: {
            generation: true,
          },
        },
      },
    });

    if (!talent) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
    }

    return NextResponse.json({ talent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, talentGenerations = [] } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Le nom du talent est requis' },
        { status: 400 },
      );
    }

    await prisma.talent.update({
      where: { id },
      data: { name },
    });

    const existing = await prisma.talentGeneration.findMany({
      where: { talentId: id },
    });

    const incomingWithId = talentGenerations.filter((tg) => tg.id);
    const incomingIds = incomingWithId.map((tg) => tg.id);

    const toDeleteIds = existing
      .filter((tg) => !incomingIds.includes(tg.id))
      .map((tg) => tg.id);

    if (toDeleteIds.length > 0) {
      await prisma.talentGeneration.deleteMany({
        where: {
          id: { in: toDeleteIds },
        },
      });
    }

    const toCreate = talentGenerations.filter((tg) => !tg.id);
    if (toCreate.length > 0) {
      await prisma.talentGeneration.createMany({
        data: toCreate.map((tg) => ({
          talentId: id,
          generationId: tg.generationId,
          description: tg.description,
        })),
      });
    }

    await Promise.all(
      incomingWithId.map((tg) =>
        prisma.talentGeneration.update({
          where: { id: tg.id },
          data: {
            generationId: tg.generationId,
            description: tg.description,
          },
        }),
      ),
    );

    const updatedTalent = await prisma.talent.findUnique({
      where: { id },
      include: {
        talentGenerations: {
          include: {
            generation: true,
          },
        },
      },
    });

    return NextResponse.json({ talent: updatedTalent }, { status: 200 });
  } catch (error) {
    console.error('Error updating talent:', error);
    return NextResponse.json(
      { error: 'Failed to update talent' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    await prisma.talentGeneration.deleteMany({
      where: { talentId: id },
    });

    await prisma.talent.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Talent deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting talent:', error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer ce talent car il est encore utilisé ailleurs.',
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete talent' },
      { status: 500 },
    );
  }
}
