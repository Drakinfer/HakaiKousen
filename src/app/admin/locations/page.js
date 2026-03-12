'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import { Icon, SquarePen, Trash } from '../../../../lib/lucide';

import Aside from '@/app/components/Aside';
import LocationFormModal from '@/app/components/modal/LocationFormModal';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchLocations } from '@/lib/fetch';

import Table from '@/app/components/Table';

export default function AdminLocationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);

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
        let l = await fetchLocations();
        setLocations(l);
      } catch (e) {
        console.error('Erreur lors du chargement des habitats', e);
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
    setSelectedLocation(null);
    setOpenModal(true);
  };

  const handleEditClick = (location) => {
    setSelectedLocation(location);
    setOpenModal(true);
  };

  const handleDeleteType = async (locationId) => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer cet habitat ?',
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        let message = "Erreur lors de la suppression de l'habitat";

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (_) {}

        return;
      }

      let l = await fetchLocations();
      setLocations(l);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erreur inattendue lors de la suppression');
    }
  };

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedLocation(null);
    let l = await fetchLocations();
    setLocations(l);
  };

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Locations"
        actions={[
          {
            label: 'Ajouter un habitat',
            onClick: handleAddClick,
            icon: faPlus,
          },
        ]}
      />
      <div className="flex-1 flex flex-col overflow-hidden px-8 py-6">
        <Table
          rows={locations}
          rowKey={(l) => l.id}
          containerClassName="h-full overflow-y-auto"
          tableClassName="min-w-full text-sm"
          headClassName="bg-red-500 text-white sticky top-0 z-10"
          columns={[
            { key: 'name', header: 'Nom' },
            {
              key: 'icon',
              header: 'Icon',
              render: (l) => <Icon name={l.icon} />,
            },
            {
              key: 'action',
              header: 'Action',
              render: (l) => (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditClick(l)}
                    className="p-1 hover:scale-105 transition-transform"
                  >
                    <SquarePen color="red" />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteType(l.id)}
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
          <LocationFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            location={selectedLocation}
            onSaved={fetchLocations}
          />
        )}
      </div>
    </main>
  );
}
