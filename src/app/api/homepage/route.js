import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';

export async function GET() {
  try {
    const items = await prisma.homePageParagraph.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isNotification: 'desc' }, { rank: 'asc' }],
    });
    return Response.json({ items }, { status: 200 });
  } catch (e) {
    console.error('[GET /api/homepage-paragraphs]', e);
    return serverError('Internal error');
  }
}

export async function POST(req) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  let body;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  const title = body?.title ?? null;
  const text = body?.text ?? null;
  const isNotification = Boolean(body?.isNotification);
  const rank =
    body?.rank === '' || body?.rank === null || body?.rank === undefined
      ? 0
      : Number(body.rank);

  if (Number.isNaN(rank))
    return Response.json('rank must be a number', { status: 400 });

  const userId = user?.id;
  if (!userId) return Response.json('userID missing', { status: 400 });

  try {
    const created = await prisma.homePageParagraph.create({
      data: {
        title,
        text,
        isNotification,
        rank,
        createdById: userId,
        updatedById: userId,
      },
    });
    return Response.json({ item: created }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/homepage-paragraphs]', e);
    return Response.json('API error', { status: 500 });
  }
}
