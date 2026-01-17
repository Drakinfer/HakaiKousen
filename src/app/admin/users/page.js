'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UsersTable from '@/app/components/UsersTable';
import Loading from '@/app/components/Loading';
import { fetchUsers } from '@/lib/fetch';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session || session.user?.role !== 'ADMIN') return;

    const load = async () => {
      setLoading(true);
      try {
        let u = await fetchUsers();
        setUsers(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  const handleUpdateRole = async (id, action) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Erreur lors de la modification du rôle');
        return;
      }

      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } finally {
      setLoading(false);
    }
  };

  if (
    status === 'loading' ||
    !session ||
    session.user?.role !== 'ADMIN' ||
    loading
  ) {
    return <Loading />;
  }

  return (
    <main className="flex flex-col h-main overflow-hidden px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

      <div className="flex-1 overflow-hidden rounded">
        <UsersTable users={users} onUpdateRole={handleUpdateRole} />
      </div>
    </main>
  );
}
