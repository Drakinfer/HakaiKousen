'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Aside = ({ actions, isAdmin }) => {
  const visibleActions = actions.filter((action) => {
    if (action.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <aside className="bg-red-500 h-full w-16 flex flex-col text-center text-white flex-shrink-0 py-4">
      {visibleActions.map((action, index) => {
        const icon = (
          <div className="text-white mb-4 w-8 mx-auto flex flex-col items-center cursor-pointer">
            <FontAwesomeIcon icon={action.icon} size="lg" />
          </div>
        );

        if (action.href) {
          return (
            <Link key={index} href={action.href} title={action.title}>
              {icon}
            </Link>
          );
        }

        return (
          <button key={index} title={action.title} onClick={action.onClick}>
            {icon}
          </button>
        );
      })}
    </aside>
  );
};
export default Aside;
