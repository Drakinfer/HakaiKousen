'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Aside = ({ actions }) => {
  return (
    <aside className="bg-red-500 h-full w-16 flex flex-col text-center text-white flex-shrink-0 py-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="text-white mb-4 w-8 mx-auto flex flex-col items-center"
          title={action.title}
        >
          <FontAwesomeIcon icon={action.icon} size="lg" />
        </Link>
      ))}
    </aside>
  );
};

export default Aside;
