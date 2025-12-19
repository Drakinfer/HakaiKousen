import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, pseudo: user.name } },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(userId);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, name } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanEmail || !cleanName) {
      return NextResponse.json(
        { error: 'Email et pseudo requis' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé.' },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { email: cleanEmail, name: cleanName },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json(
      { user: { id: updated.id, email: updated.email, pseudo: updated.name } },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    );
  }
}
