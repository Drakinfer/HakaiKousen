'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import GenerationFormModal from '@/app/components/modal/GenerationFormModal';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchGenerations } from '@/lib/fetch';

export default function AdminGenerationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  const load = async () => {
    try {
      setLoading(true);
      let g = await fetchGenerations();
      setGenerations(g);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || session.user?.role === 'USER') return;

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
    setSelectedGeneration(null);
    setOpenModal(true);
  };

  const handleEditClick = (generation) => {
    setSelectedGeneration(generation);
    setOpenModal(true);
  };

  const handleDeleteGeneration = async (generationId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer cette génération ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/generations/${generationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression de la génération';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      let g = await fetchGenerations();
      setGenerations(g);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGeneration(null);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Générations"
        actions={[
          {
            label: 'Ajouter une génération',
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
                <th className="border px-3 py-2 text-left">Rang</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => (
                <tr key={g.id}>
                  <td className="border px-3 py-2">{g.name}</td>
                  <td className="border px-3 py-2">{g.rank}</td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(g)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteGeneration(g.id)}
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
          <GenerationFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            generation={selectedGeneration}
            onSaved={load}
          />
        )}
      </div>
    </main>
  );
}
