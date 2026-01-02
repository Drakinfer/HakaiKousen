import prisma from '../../../../../lib/prisma';
import { requireApiRole } from '../../../../../lib/apiAuth';
import { NextResponse } from 'next/server';

// GET /api/teams/123
export async function GET(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = Number(params.id);
  if (Number.isNaN(id))
    return new Response('Invalid team id', {
      status: 404,
    });

  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        pseudo: { select: { id: true, name: true, email: true, image: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!team)
      return new Response('Member not found', {
        status: 404,
      });
    return new Response(
      { team },
      {
        status: 201,
      },
    );
  } catch (e) {
    console.error('[GET /api/teams/[id]] error:', e);
    return new Response('Failed to fetch member', {
      status: 500,
    });
  }
}

// PUT /api/teams/123
// body: { role?: "string", pseudoId?: number }
export async function PUT(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = Number(params.id);
  if (Number.isNaN(id))
    return new Response('Invalid team id', {
      status: 404,
    });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', {
      status: 404,
    });
  }

  const data = {};

  if (body?.role !== undefined) {
    if (typeof body.role !== 'string')
      return new Response('role must be a string', {
        status: 404,
      });
    const role = body.role.trim();
    if (!role)
      return new Response('role cannot be empty', {
        status: 404,
      });
    data.role = role;
  }

  if (body?.pseudoId !== undefined) {
    const pseudoId = Number(body.pseudoId);
    if (Number.isNaN(pseudoId))
      return new Response('pseudoId must be a number', {
        status: 404,
      });

    data.pseudoId = pseudoId;
  }

  if (Object.keys(data).length === 0) {
    return new Response('No fields to update', {
      status: 404,
    });
  }

  data.updatedById = user.id;

  try {
    const existing = await prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return new Response('Member not found', {
        status: 404,
      });

    const team = await prisma.team.update({
      where: { id },
      data,
      include: {
        pseudo: { select: { id: true, name: true, email: true, image: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return new Response(JSON.stringify({ team }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[PUT /api/teams/[id]] error:', e);
    return new Response('Failed to update team member', {
      status: 500,
    });
  }
}

// DELETE /api/teams/123
export async function DELETE(req, { params }) {
  const { ok, res } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  console.log('[DELETE /api/teams/[id]] url:', req.url, 'params:', params);

  const id = Number(params.id);
  if (Number.isNaN(id))
    return new Response('Invalid team id', {
      status: 404,
    });

  try {
    const existing = await prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return new Response('Member not found', {
        status: 404,
      });

    await prisma.team.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('[DELETE /api/teams/[id]] error:', e);
    return new Response('Failed to delete team member', {
      status: 500,
    });
  }
}
