import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { requireApiRole } from '../../../../../../lib/apiAuth';

export async function PATCH(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = Number(params.id);
  const { action } = await req.json();

  let newRole = null;
  if (action === 'promote') newRole = 'EDITOR';
  if (action === 'demote') newRole = 'USER';

  if (!newRole) {
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(updated, { status: 200 });
}
