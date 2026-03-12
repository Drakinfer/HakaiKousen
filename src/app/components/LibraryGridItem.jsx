'use client';

import GridItem from './GridItem';
import { Icon } from '../../../lib/lucide';

function isVercelBlob(url) {
  return /blob\.vercel-storage\.com/i.test(url);
}

export default function LibraryGridItem({ item: doc }) {
  const isBlob = isVercelBlob(doc.link);

  return (
    <GridItem
      as="a"
      href={doc.link}
      download={isBlob ? '' : undefined}
      target={isBlob ? undefined : '_self'}
      rel={isBlob ? undefined : 'noreferrer'}
      title={isBlob ? 'Télécharger' : 'Ouvrir'}

      icon={<Icon name={doc.icon || 'book'} className="w-6 h-6 sm:w-7 sm:h-7" />}
      primary={doc.name}
    />
  );
}
