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

import Table from '@/app/components/Table';

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
  }, [status, session, router, isAdmin]);

  useEffect(() => {
    if (!session || !isAdmin) return;

    const load = async () => {
      try {
        setLoading(true);
        let m = await fetchMembers();
        setTeams(m);
      } catch (e) {
        console.error('Erreur lors du chargement des membres', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session, isAdmin]);

  if (status === 'loading' || !session || loading) {
    return <Loading />;
  }

  const handleAddClick = async () => {
    let u = await fetchUsers();
    setUsers(u);
    setSelectedMember(null);
    setOpenModal(true);
  };

  const handleEditClick = async (member) => {
    let u = await fetchUsers();
    setUsers(u);
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

      let m = await fetchMembers();
      setTeams(m);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedMember(null);
    let m = await fetchMembers();
    setTeams(m);
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
        <Table
          rows={teams}
          rowKey={(member) => member.id}
          containerClassName="h-full overflow-y-auto"
          tableClassName="min-w-full text-sm"
          headClassName="bg-red-500 text-white sticky top-0 z-10"
          columns={[
            {
              key: 'pseudo',
              header: 'Pseudo',
              render: (member) => member.pseudo?.name ?? '—',
            },
            { key: 'role', header: 'Role' },
            {
              key: 'created',
              header: 'Créé par/le',
              render: (member) => (
                <span>
                  Par {member.createdBy?.name} le {member.createdAt}
                </span>
              ),
            },
            {
              key: 'updated',
              header: 'Modifié par/le',
              render: (member) => (
                <span>
                  Par {member.updatedBy?.name} le {member.updatedAt}
                </span>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              render: (member) => (
                <div className="flex items-center gap-1">
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
                </div>
              ),
            },
          ]}
        />

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
