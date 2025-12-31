import prisma from '../../../../lib/prisma';
import { requireApiRole } from '../../../../lib/apiAuth';
import { put } from '@vercel/blob';

function badRequest(message) {
  return new Response(message, { status: 400 });
}

export async function GET(req) {
  const { ok, res } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return Response.json({ documents });
  } catch (e) {
    console.error('[GET /api/admin/library] error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function isLikelyVercelBlobUrl(url) {
  if (typeof url !== 'string') return false;
  return (
    url.includes('.blob.vercel-storage.com/') ||
    url.includes('vercel-storage.com/')
  );
}

function normalizeUrl(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export async function POST(req) {
  const { ok, res, user } = await requireApiRole(req, 'EDITOR');
  if (!ok) return res;

  let formData;
  try {
    formData = await req.formData();
  } catch (e) {
    console.error('[POST /api/admin/library] formData error:', e);
    return badRequest('Invalid form-data');
  }

  const nameRaw = formData.get('name');
  const iconRaw = formData.get('icon');
  const file = formData.get('file');
  const linkRaw = formData.get('link');

  const name = typeof nameRaw === 'string' ? nameRaw.trim() : '';
  const icon = typeof iconRaw === 'string' ? iconRaw.trim() : null;
  const link = normalizeUrl(linkRaw);

  if (!name) return badRequest('Missing "name"');

  const hasFile = !!file;
  const hasLink = !!link;

  if (!hasFile && !hasLink) return badRequest('Provide "file" or "link"');
  if (hasFile && hasLink)
    return badRequest('Provide only one: "file" OR "link"');

  try {
    let finalLink = link;
    let blobInfo = null;

    if (hasFile) {
      if (!(file instanceof File)) return badRequest('"file" must be a File');

      const safeFilename = (file.name || 'document').replace(/\s+/g, '_');
      const blob = await put(`library/${safeFilename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type || undefined,
      });

      finalLink = blob.url;
      blobInfo = { url: blob.url, pathname: blob.pathname };
    }

    const document = await prisma.document.create({
      data: {
        name,
        icon,
        link: finalLink,
        createdById: user.id,
        updatedById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return Response.json({ document, blob: blobInfo }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/admin/library] error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
