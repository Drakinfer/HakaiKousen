'use client';

import GridItem from './GridItem';
import { User } from '../../../lib/lucide';

export default function MemberGridItem({ item: member }) {
  return (
    <GridItem
      as="div"
      icon={<User className="w-6 h-6 sm:w-7 sm:h-7" />}
      primary={member.pseudo?.name || ''}
      secondary={member.role || ''}
    />
  );
}
