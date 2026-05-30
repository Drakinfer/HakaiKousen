import { requireApiRole } from '../../../../../lib/apiAuth';
import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Type ID is required' }, { status: 400 });
  }

  try {
    const type = await prisma.types.findUnique({
      where: { id: parseInt(id) },
      include: {
        generations: true,
      },
    });

    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json({ type }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await req.json();

    const { name, generationId, ...multipliers } = body;

    if (!name || !generationId) {
      return NextResponse.json(
        { error: 'Nom et génération obligatoires' },
        { status: 400 },
      );
    }

    const updated = await prisma.type.update({
      where: { id },
      data: {
        name,
        generationId: Number(generationId),
        ...multipliers,
      },
    });

    return NextResponse.json({ type: updated }, { status: 200 });
  } catch (err) {
    console.error('Erreur PUT /api/types/:id :', err);

    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Type introuvable' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du type' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    await prisma.type.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Erreur DELETE /api/types/:id :', err);

    if (err.code === 'P2003') {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer ce type : il est encore utilisé dans d’autres données.',
        },
        { status: 400 },
      );
    }

    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Type introuvable' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du type' },
      { status: 500 },
    );
  }
}
