'use client';

import { Icon } from '../../../lib/lucide';

function isVercelBlob(url) {
  return /blob\.vercel-storage\.com/i.test(url);
}

export default function LibraryGridItem({ doc }) {
  const isBlob = isVercelBlob(doc.link);

  return (
    <a
      href={doc.link}
      download={isBlob ? '' : undefined}
      target={isBlob ? undefined : '_blank'}
      rel={isBlob ? undefined : 'noreferrer'}
      className="group transition p-3 flex flex-col items-center gap-2"
      title={isBlob ? 'Télécharger' : 'Ouvrir la page de téléchargement'}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
        <Icon name={doc.icon || 'book'} className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>

      <p className="text-xs sm:text-sm font-medium text-center line-clamp-2 break-words">
        {doc.name}
      </p>
    </a>
  );
}
