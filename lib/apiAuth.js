import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { verifyApiJwt, hasMinRole } from './apiJwt';

export async function requireApiRole(req, minRole) {
  const session = await getServerSession(authOptions).catch(() => null);

  if (session?.user?.role) {
    if (!hasMinRole(session.user.role, minRole)) {
      return {
        ok: false,
        res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    return {
      ok: true,
      user: {
        id: Number(session.user.id),
        role: session.user.role,
      },
    };
  }

  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = await verifyApiJwt(token);
    const userRole = payload.role;

    if (!hasMinRole(userRole, minRole)) {
      return {
        ok: false,
        res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    return {
      ok: true,
      user: {
        id: Number(payload.sub),
        role: userRole,
      },
    };
  } catch (err) {
    console.error('JWT API invalide', err);
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
}
