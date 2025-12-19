import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user_id = Number(userId);
    if (Number.isNaN(user_id))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const gp = await prisma.generatedPokemon.findFirst({
      where: { id, userId: user_id },
      select: { id: true },
    });

    if (!gp) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.generatedPokemon.delete({ where: { id } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete generatedPokemon' },
      { status: 500 },
    );
  }
}
