'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import CompetenceFormModal from '@/app/components/modal/CompetenceFormModal';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchCompetences } from '@/lib/fetch';

export default function AdminTypesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState([]);

  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session || session.user?.role === 'USER') return;

    const load = async () => {
      try {
        setLoading(true);
        await fetchCompetences(setCompetences);
      } catch (e) {
        console.error('Erreur lors du chargement des compétences', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  if (
    status === 'loading' ||
    !session ||
    session.user?.role === 'USER' ||
    loading
  ) {
    return <Loading />;
  }

  const handleAddClick = () => {
    setSelectedCompetence(null);
    setOpenModal(true);
  };

  const handleEditClick = (competence) => {
    setSelectedCompetence(competence);
    setOpenModal(true);
  };

  const handleDeleteType = async (competenceId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer cette competence ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/competences/${competenceId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression de la compétence';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      await fetchCompetences(setCompetences);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedCompetence(null);
    await fetchCompetences(setCompetences);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Types"
        actions={[
          {
            label: 'Ajouter une compétence',
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
                <th className="border px-3 py-2 text-left">Nom</th>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {competences.map((c) => (
                <tr key={c.id}>
                  <td className="border px-3 py-2">{c.name}</td>
                  <td className="border px-3 py-2">{c.description}</td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(c)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteType(c.id)}
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
          <CompetenceFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            competence={selectedCompetence}
            onSaved={fetchCompetences}
          />
        )}
      </div>
    </main>
  );
}
