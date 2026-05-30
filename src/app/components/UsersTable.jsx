'use client';

import Table from '@/app/components/Table';

export default function UsersTable({ users, onUpdateRole }) {
  return (
    <Table
      rows={users}
      rowKey={(u) => u.id}
      containerClassName="h-full overflow-y-auto"
      tableClassName="min-w-full text-sm"
      headClassName="bg-gray-100 sticky top-0 z-10"
      columns={[
        { key: 'name', header: 'Nom' },
        {
          key: 'email',
          header: 'Email',
          thClassName: 'hidden md:table-cell',
          tdClassName: 'hidden md:table-cell',
        },
        { key: 'role', header: 'Rôle' },
        {
          key: 'action',
          header: 'Action',
          render: (u) => {
            let actionLabel = null;
            let actionType = null;

            if (u.role === 'USER') {
              actionLabel = 'Promouvoir EDITOR';
              actionType = 'promote';
            } else if (u.role === 'EDITOR') {
              actionLabel = 'Rétrograder USER';
              actionType = 'demote';
            }

            return actionType ? (
              <button
                type="button"
                onClick={() => onUpdateRole(u.id, actionType)}
                className="px-3 py-1 rounded bg-red-500 text-white text-xs disabled:opacity-60"
              >
                {actionLabel}
              </button>
            ) : (
              <span className="text-gray-400 text-xs">—</span>
            );
          },
        },
      ]}
    />
  );
}
