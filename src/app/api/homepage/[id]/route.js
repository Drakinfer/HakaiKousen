import prisma from '../../../../../lib/prisma';
import { requireApiRole } from '../../../../../lib/apiAuth';

function parseId(params) {
  const id = Number(params?.id);
  if (Number.isNaN(id)) return null;
  return id;
}

export async function GET(_req, { params }) {
  const id = parseId(params);
  if (!id) return Response.json('Invalid id', { status: 400 });

  try {
    const item = await prisma.homePageParagraph.findUnique({ where: { id } });
    if (!item) return Response.json('Not found', { status: 404 });
    return Response.json({ item }, { status: 200 });
  } catch (e) {
    console.error('[GET /api/homepage-paragraphs/[id]]', e);
    return Response.json('Internal error', { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = parseId(params);
  if (!id) return Response.json('Invalid id', { status: 400 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json('Invalid JSON', { status: 400 });
  }

  const data = {};
  if ('title' in body) data.title = body.title ?? null;
  if ('text' in body) data.text = body.text ?? null;
  if ('isNotification' in body)
    data.isNotification = Boolean(body.isNotification);
  if ('rank' in body) {
    const rank =
      body.rank === '' || body.rank === null || body.rank === undefined
        ? 0
        : Number(body.rank);
    if (Number.isNaN(rank))
      return Response.json('rank must be a number', { status: 400 });
    data.rank = rank;
  }

  const userId = user?.id;
  if (!userId) return Response.json('Missing auth user id', { status: 400 });
  data.updatedById = userId;

  try {
    const existing = await prisma.homePageParagraph.findUnique({
      where: { id },
    });
    if (!existing) return Response.json('Not found', { status: 404 });

    const updated = await prisma.homePageParagraph.update({
      where: { id },
      data,
    });

    return Response.json({ item: updated }, { status: 200 });
  } catch (e) {
    console.error('[PUT /api/homepage-paragraphs/[id]]', e);
    return Response.json('Internal error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = parseId(params);
  if (!id) return badRequest('Invalid id');

  try {
    const existing = await prisma.homePageParagraph.findUnique({
      where: { id },
    });
    if (!existing) return notFound('Not found');

    await prisma.homePageParagraph.delete({ where: { id } });
    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('[DELETE /api/homepage-paragraphs/[id]]', e);
    return Response.json('Internal error', { status: 500 });
  }
}
