'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import AttacksTable from '@/app/components/AttacksTable';
import AttacksFilter from '@/app/components/filters/AttackFilters';
import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchAttacks, fetchTypes } from '@/lib/fetch';

import { toFr } from '@/lib/types';
import AttackFormModal from '@/app/components/modal/AttackFormModal';

export default function AdminAttacksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attacks, setAttacks] = useState([]);
  const [types, setTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let a = await fetchAttacks(nameFilter, typeFilter);
        setAttacks(a);
        let t = await fetchTypes();
        setTypes(t);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = async () => {
    let a = await fetchAttacks(nameFilter, typeFilter);
    setAttacks(a);
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleAttackSaved = async () => {
    let a = await fetchAttacks(nameFilter, typeFilter);
    setAttacks(a);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex h-main overflow-hidden">
      <Aside
        title="Attaques"
        actions={[
          {
            label: 'Ajouter une attaque',
            onClick: handleAddClick,
            icon: faPlus,
          },
        ]}
      />
      <div className="flex-1 flex flex-col items-center p-1">
        <div className="w-full max-w-5xl mb-4">
          <AttacksFilter
            name={nameFilter}
            typeId={typeFilter}
            types={types}
            onNameChange={setNameFilter}
            onTypeChange={setTypeFilter}
            onSearch={handleSearch}
          />
        </div>

        <AttacksTable attacks={attacks} basePath="/admin/attacks" />
      </div>

      <AttackFormModal
        isOpen={openModal}
        onClose={handleCloseModal}
        onAttackSaved={handleAttackSaved}
      />
    </main>
  );
}
