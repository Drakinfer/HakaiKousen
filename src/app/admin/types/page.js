'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import TypeFormModal from '@/app/components/modal/TypeFormModal';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchTypes } from '@/lib/fetch';

export default function AdminTypesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

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
        let t = await fetchTypes();
        setTypes(t);
      } catch (e) {
        console.error(e);
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
    setSelectedType(null);
    setOpenModal(true);
  };

  const handleEditClick = (type) => {
    setSelectedType(type);
    setOpenModal(true);
  };

  const handleDeleteType = async (typeId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer ce type ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/types/${typeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = 'Erreur lors de la suppression du type';

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      let t = await fetchTypes();
      setTypes(t);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedType(null);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Types"
        actions={[
          {
            label: 'Ajouter un type',
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
                <th className="border px-3 py-2 text-left">Génération</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id}>
                  <td className="border px-3 py-2">{t.labelFr}</td>
                  <td className="border px-3 py-2">{t.type.generation.name}</td>
                  <td className="border px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(t.type)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <SquarePen color="red" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteType(t.id)}
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
          <TypeFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            type={selectedType}
            onSaved={fetchTypes}
          />
        )}
      </div>
    </main>
  );
}
