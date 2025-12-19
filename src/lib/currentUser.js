import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '../../lib/prisma';

export async function getCurrentUserMinimal() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  const id = Number(userId);
  if (Number.isNaN(id)) return null;

  return { id, role: session.user.role, email: session.user.email };
}

export async function getCurrentUserProfile() {
  const me = await getCurrentUserMinimal();
  if (!me) return null;

  const user = await prisma.user.findUnique({
    where: { id: me.id },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}
