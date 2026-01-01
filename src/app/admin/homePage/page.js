'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchParagraphs } from '@/lib/fetch';
import HomePageFormModal from '@/app/components/modal/HomePageFormModal';

export default function AdminSitePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session || session.user?.role !== 'ADMIN') return;

    const load = async () => {
      try {
        setLoading(true);
        await fetchParagraphs(setParagraphs);
      } catch (e) {
        console.error('Erreur lors du chargement des textes', e);
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
    setSelectedParagraph(null);
    setOpenModal(true);
  };

  const handleEditClick = (paragraph) => {
    setSelectedParagraph(paragraph);
    setOpenModal(true);
  };

  const handleDeleteParagraph = async (paragraphId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer ce texte ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/homepage/${paragraphId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression du texte';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      await fetchParagraphs(setParagraphs);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedParagraph(null);
    await fetchParagraphs(setParagraphs);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Paragraphs"
        actions={[
          {
            label: 'Ajouter un texte',
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
                <th className="border px-3 py-2 text-left">Titre</th>
                <th className="border px-3 py-2 text-left">Texte</th>
                <th className="border px-3 py-2 text-left">Notification</th>
                <th className="border px-3 py-2 text-left">Rang</th>
                <th className="border px-3 py-2 text-left">Créé par/le</th>
                <th className="border px-3 py-2 text-left">Modifié par/le</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paragraphs.map((p) => (
                <tr key={p.id}>
                  <td className="border px-3 py-2">{p.title}</td>
                  <td className="border px-3 py-2">{p.text}</td>
                  <td className="border px-3 py-2">
                    {p.isNotification ? 'Oui' : 'Non'}
                  </td>
                  <td className="border px-3 py-2">{p.rank}</td>
                  <td className="border px-3 py-2">
                    Par {p.createdBy.name} le {p.createdAt}
                  </td>
                  <td className="border px-3 py-2">
                    Par {p.updatedBy.name} le {p.updatedAt}
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(p)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteParagraph(p.id)}
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
          <HomePageFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            paragraph={selectedParagraph}
            onSaved={fetchParagraphs}
          />
        )}
      </div>
    </main>
  );
}
