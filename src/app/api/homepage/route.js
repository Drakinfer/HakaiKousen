import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const items = await prisma.homePageParagraph.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isNotification: 'desc' }, { rank: 'asc' }],
    });
    return NextResponse.json({ items: items }, { status: 200 });
  } catch (e) {
    console.error('[GET /api/homepage-paragraphs]', e);
    return NextResponse.json(
      { error: 'failed to fetch paragraphs' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = body?.title ?? null;
  const text = body?.text ?? null;
  const isNotification = Boolean(body?.isNotification);
  const rank =
    body?.rank === '' || body?.rank === null || body?.rank === undefined
      ? 0
      : Number(body.rank);

  if (Number.isNaN(rank))
    return NextResponse.json(
      { error: 'rank must be a number' },
      { status: 400 },
    );

  const userId = user?.id;
  if (!userId)
    return NextResponse.json({ error: 'userID missing' }, { status: 400 });

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
    return NextResponse.json({ error: 'API error' }, { status: 500 });
  }
}
