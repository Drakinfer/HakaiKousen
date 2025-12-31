'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchDocuments } from '@/lib/fetch';
import LibraryFormModal from '@/app/components/modal/LibraryFormModal';

export default function AdminLibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
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
        await fetchDocuments(setDocuments);
      } catch (e) {
        console.error('Erreur lors du chargement des documents', e);
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
    setSelectedDocument(null);
    setOpenModal(true);
  };

  const handleEditClick = (document) => {
    setSelectedDocument(document);
    setOpenModal(true);
  };

  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer ce document ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/library/${documentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression du document';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      await fetchDocuments(setDocuments);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedDocument(null);
    await fetchDocuments(setDocuments);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Documents"
        actions={[
          {
            label: 'Ajouter un document',
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
                <th className="border px-3 py-2 text-left">Icone</th>
                <th className="border px-3 py-2 text-left">Lien</th>
                <th className="border px-3 py-2 text-left">Créé par/le</th>
                <th className="border px-3 py-2 text-left">Modifié par/le</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td className="border px-3 py-2">{d.name}</td>
                  <td className="border px-3 py-2">{d.icon}</td>
                  <td className="border px-3 py-2">{d.link}</td>
                  <td className="border px-3 py-2">
                    Par {d.createdBy.name} le {d.createdAt}
                  </td>
                  <td className="border px-3 py-2">
                    Par {d.updatedBy.name} le {d.updatedAt}
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(d)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(d.id)}
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
          <LibraryFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            document={selectedDocument}
            onSaved={fetchDocuments}
          />
        )}
      </div>
    </main>
  );
}
