import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { requireApiRole } from '../../../../../lib/apiAuth';

export async function PUT(req, { params }) {
  try {
    const { ok, res } = await requireApiRole(req, 'EDITOR');
    if (!ok) return res;

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
    }

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

    const competence = await prisma.competence.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json(competence);
  } catch (error) {
    console.error(error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Compétence introuvable.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la compétence.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { ok, res } = await requireApiRole(req, 'ADMIN');
    if (!ok) return res;

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
    }

    await prisma.competence.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer cette compétence : elle est utilisée par un ou plusieurs Pokémon.',
        },
        { status: 409 },
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Compétence introuvable.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la compétence.' },
      { status: 500 },
    );
  }
}
