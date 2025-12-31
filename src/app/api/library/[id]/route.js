import prisma from '../../../../../lib/prisma';
import { requireApiRole } from '../../../../../lib/apiAuth';
import { put, del } from '@vercel/blob';

function badRequest(message) {
  return new Response(message, { status: 400 });
}
function notFound(message = 'Not Found') {
  return new Response(message, { status: 404 });
}
function normalizeUrl(value) {
  return typeof value === 'string' ? value.trim() : '';
}
function isLikelyVercelBlobUrl(url) {
  if (typeof url !== 'string') return false;
  return (
    url.includes('.blob.vercel-storage.com/') ||
    url.includes('vercel-storage.com/')
  );
}

export async function PUT(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  const id = Number(params.id);
  if (Number.isNaN(id)) return badRequest('Invalid document id');

  let formData;
  try {
    formData = await req.formData();
  } catch (e) {
    console.error('[PUT /api/admin/library/[id]] formData error:', e);
    return badRequest('Invalid form-data');
  }

  const nameRaw = formData.get('name');
  const iconRaw = formData.get('icon');
  const file = formData.get('file'); // optionnel
  const linkRaw = formData.get('link'); // optionnel

  const data = {};
  if (typeof nameRaw === 'string') data.name = nameRaw.trim();
  if (typeof iconRaw === 'string') data.icon = iconRaw.trim();

  const link = normalizeUrl(linkRaw);
  const hasFile = !!file;
  const hasLink = !!link;

  if (hasFile && hasLink) {
    return badRequest('Provide only one: "file" OR "link"');
  }

  try {
    const existing = await prisma.document.findUnique({
      where: { id },
      select: { id: true, link: true },
    });
    if (!existing) return notFound('Document not found');

    let newBlobInfo = null;

    if (hasFile) {
      if (!(file instanceof File)) return badRequest('"file" must be a File');

      const safeFilename = (file.name || 'document').replace(/\s+/g, '_');
      const blob = await put(`library/${safeFilename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type || undefined,
      });

      data.link = blob.url;
      newBlobInfo = { url: blob.url, pathname: blob.pathname };
    }

    if (hasLink) {
      data.link = link;
    }

    if (Object.keys(data).length === 0) {
      return badRequest('No fields to update');
    }

    data.updatedById = user.id;

    const document = await prisma.document.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    const linkChanged =
      typeof data.link === 'string' && data.link !== existing.link;
    if (linkChanged && isLikelyVercelBlobUrl(existing.link)) {
      await del(existing.link);
    }

    return Response.json({ document, blob: newBlobInfo });
  } catch (e) {
    console.error('[PUT /api/admin/library/[id]] error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { ok, res, user } = await requireApiRole(req, 'ADMIN');
  if (!ok) return res;

  const id = Number(params.id);
  if (Number.isNaN(id)) return badRequest('Invalid document id');

  try {
    const existing = await prisma.document.findUnique({
      where: { id },
      select: { id: true, link: true },
    });
    if (!existing) return notFound('Document not found');

    if (isLikelyVercelBlobUrl(existing.link)) {
      await del(existing.link);
    }

    await prisma.document.delete({ where: { id } });

    return Response.json({ ok: true, deletedId: id, deletedBy: user.id });
  } catch (e) {
    console.error('[DELETE /api/admin/library/[id]] error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
