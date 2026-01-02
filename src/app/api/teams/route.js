import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';

// GET /api/teams
export async function GET(req) {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        pseudo: { select: { id: true, name: true, email: true, image: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return new Response(JSON.stringify({ teams }), {
      status: 201,
    });
  } catch (e) {
    console.error('[GET /api/teams] error:', e);
    return new Response('Failed to fetch teams', {
      status: 500,
    });
  }
}

// POST /api/teams
// body: { role: "string", pseudoId: 1 }
export async function POST(req) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', {
      status: 404,
    });
  }

  const role = typeof body?.role === 'string' ? body.role.trim() : '';
  const pseudoId = Number(body?.pseudoId);

  if (!role)
    return new Response('role is required', {
      status: 404,
    });
  if (Number.isNaN(pseudoId))
    return new Response('pseudoId is required', {
      status: 404,
    });

  try {
    const pseudo = await prisma.team.findUnique({
      where: { pseudoId: pseudoId },
      select: { id: true },
    });
    if (pseudo)
      return new Response('pseudoId already exist', {
        status: 404,
      });

    const team = await prisma.team.create({
      data: {
        role,
        pseudoId,
        createdById: user.id,
        updatedById: user.id,
      },
      include: {
        pseudo: { select: { id: true, name: true, email: true, image: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return new Response(JSON.stringify({ team }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[POST /api/teams] error:', e);
    return new Response('Failed to create team member', {
      status: 500,
    });
  }
}
