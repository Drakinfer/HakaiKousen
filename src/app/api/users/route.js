import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';

export async function GET(req) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 },
    );
  }
}
