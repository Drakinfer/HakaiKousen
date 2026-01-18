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

import Table from '@/app/components/Table';

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
        let d = await fetchDocuments();
        setDocuments(d);
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

      let d = await fetchDocuments();
      setDocuments(d);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedDocument(null);
    let d = await fetchDocuments();
    setDocuments(d);
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
        <Table
          rows={documents}
          rowKey={(d) => d.id}
          containerClassName="h-full overflow-y-auto"
          tableClassName="min-w-full text-sm"
          headClassName="bg-red-500 text-white sticky top-0 z-10"
          columns={[
            { key: 'name', header: 'Nom' },
            { key: 'icon', header: 'Icone' },
            { key: 'link', header: 'Lien' },
            {
              key: 'created',
              header: 'Créé par/le',
              render: (d) => (
                <span>
                  Par {d.createdBy?.name} le {d.createdAt}
                </span>
              ),
            },
            {
              key: 'updated',
              header: 'Modifié par/le',
              render: (d) => (
                <span>
                  Par {d.updatedBy?.name} le {d.updatedAt}
                </span>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              render: (d) => (
                <div className="flex items-center gap-1">
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
                </div>
              ),
            },
          ]}
        />

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
