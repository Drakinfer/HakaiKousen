import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

export async function uploadImageToBlob(file, pathPrefix) {
  if (!file) return null;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image trop lourde (max 4,5 Mo).');
  }

  if (!file.type?.startsWith('image/')) {
    throw new Error('Fichier invalide (image uniquement).');
  }

  const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${
    file.name
  }`.replaceAll(' ', '_');
  const pathname = `${pathPrefix}/${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type || undefined,
    addRandomSuffix: false,
  });

  return blob.url;
}
