import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(userId);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password too short (min 8)' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: 'Password not set for this account' },
        { status: 400 },
      );
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 },
    );
  }
}
