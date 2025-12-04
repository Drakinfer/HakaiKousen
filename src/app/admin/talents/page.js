'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TalentFilter from '@/app/components/filters/TalentFilters';
import TalentTable from '@/app/components/TalentsTable';
import { fetchTalents } from '@/lib/fetch';
import TalentFormModal from '@/app/components/modal/TalentFormModal';

export default function AdminTalentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [nameFilter, setNameFilter] = useState('');

  const handleAddClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = () => {
    fetchTalents(setTalents, setLoading, nameFilter);
  };

  const handleSubmitTalent = async (payload) => {
    await fetch('/api/talents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    handleCloseModal();
    fetchTalents(setTalents, setLoading, nameFilter);
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session || session.user?.role === 'USER') return;

    const loadData = async () => {
      await fetchTalents(setTalents, setLoading, nameFilter);

      try {
        const res = await fetch('/api/generations');
        const data = await res.json();
        setGenerations(data.generations || []);
      } catch (error) {
        console.error('Erreur lors du chargement des générations', error);
      }
    };

    loadData();
  }, [session]);

  if (
    status === 'loading' ||
    !session ||
    session.user?.role === 'USER' ||
    loading
  ) {
    return <Loading />;
  }

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Talents"
        actions={[
          {
            label: 'Ajouter un talent',
            onClick: handleAddClick,
            icon: faPlus,
          },
        ]}
      />
      <div className="flex-1 flex flex-col overflow-hidden px-8 py-6 items-center">
        <TalentFilter
          name={nameFilter}
          onNameChange={setNameFilter}
          onSearch={handleSearch}
        />

        <TalentTable talents={talents} basePath="/admin/talents" />

        {openModal && (
          <TalentFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTalent}
          />
        )}
      </div>
    </main>
  );
}
