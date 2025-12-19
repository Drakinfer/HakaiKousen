'use client';

export default function UsersTable({ users, onUpdateRole }) {
  return (
    <div className="h-full overflow-y-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0 z-2">
          <tr>
            <th className="border px-3 py-2 text-left">Nom</th>
            <th className="border px-3 py-2 text-left hidden md:block">Email</th>
            <th className="border px-3 py-2 text-left">Rôle</th>
            <th className="border px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            let actionLabel = null;
            let actionType = null;

            if (u.role === 'USER') {
              actionLabel = 'Promouvoir EDITOR';
              actionType = 'promote';
            } else if (u.role === 'EDITOR') {
              actionLabel = 'Rétrograder USER';
              actionType = 'demote';
            }

            return (
              <tr key={u.id}>
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2 hidden md:block">{u.email}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2">
                  {actionType ? (
                    <button
                      onClick={() => onUpdateRole(u.id, actionType)}
                      className="px-3 py-1 rounded bg-red-500 text-white text-xs disabled:opacity-60"
                    >
                      {actionLabel}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
