'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchMembers, fetchUsers } from '@/lib/fetch';
import TeamFormModal from '@/app/components/modal/TeamFormModal';

export default function AdminTeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [users, setUsers] = useState([]);
  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !isAdmin) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session || !isAdmin) return;

    const load = async () => {
      try {
        setLoading(true);
        await fetchMembers(setTeams);
      } catch (e) {
        console.error('Erreur lors du chargement des membres', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  if (status === 'loading' || !session || loading) {
    return <Loading />;
  }

  const handleAddClick = () => {
    fetchUsers(setUsers);
    setSelectedMember(null);
    setOpenModal(true);
  };

  const handleEditClick = (member) => {
    fetchUsers(setUsers);
    setSelectedMember(member);
    setOpenModal(true);
  };

  const handleDeleteMember = async (memberId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer ce membre de la team ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/teams/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression du membre';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      await fetchMembers(setTeams);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedMember(null);
    await fetchMembers(setTeams);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Teams"
        actions={[
          {
            label: 'Ajouter un membre',
            onClick: handleAddClick,
            icon: faPlus,
          },
        ]}
      />
      <div className="flex-1 flex flex-col overflow-hidden px-8 py-6">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-red-500 text-white sticky top-0 z-10">
              <tr>
                <th className="border px-3 py-2 text-left">Pseudo</th>
                <th className="border px-3 py-2 text-left">Role</th>
                <th className="border px-3 py-2 text-left">Créé par/le</th>
                <th className="border px-3 py-2 text-left">Modifié par/le</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            {teams.toString}
            <tbody>
              {teams.map((member) => (
                <tr key={member.id}>
                  <td className="border px-3 py-2">{member.pseudo.name}</td>
                  <td className="border px-3 py-2">{member.role}</td>
                  <td className="border px-3 py-2">
                    Par {member.createdBy.name} le {member.createdAt}
                  </td>
                  <td className="border px-3 py-2">
                    Par {member.updatedBy.name} le {member.updatedAt}
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(member)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1 hover:scale-105 transition-transform"
                      >
                        <Trash color="red" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {openModal && (
          <TeamFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            member={selectedMember}
            onSaved={fetchMembers}
            users={users}
          />
        )}
      </div>
    </main>
  );
}
