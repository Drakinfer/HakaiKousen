'use client';

import { User } from '../../../lib/lucide';

export default function MemberGridItem({ member }) {

  return (
    <div>
      <div className="flex items-center justify-center">
        <User />
      </div>

      <p className="text-m sm:text-m font-medium text-center line-clamp-2 break-words">
        {member.pseudo.name}
      </p>
      <p className="text-xs sm:text-sm font-medium text-center line-clamp-2 break-words">
        {member.role}
      </p>
    </div>
  );
}
