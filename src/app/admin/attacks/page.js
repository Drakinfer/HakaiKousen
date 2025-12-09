'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/components/Loading';
import AttacksTable from '@/app/components/AttacksTable';
import AttacksFilter from '@/app/components/filters/AttackFilters';
import Aside from '@/app/components/Aside';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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

  async function fetchAttacks(nameParam, typeParam) {
    try {
      setLoading(true);

      const effectiveName =
        typeof nameParam === 'string' ? nameParam : nameFilter;
      const effectiveType =
        typeof typeParam === 'string' ? typeParam : typeFilter;

      const params = new URLSearchParams();

      if (effectiveName.trim() !== '') {
        params.set('name', effectiveName.trim());
      }

      if (effectiveType) {
        params.set('typeName', effectiveType);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/attacks${queryString}`);
      const data = await response.json();

      if (response.ok) {
        setAttacks(data.attacks);
      }
    } catch (err) {
      console.log("Erreur de connexion à l'API");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTypes() {
    try {
      const res = await fetch('/api/types', { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad response');
      const { types = [] } = await res.json();

      const byValue = new Map();
      for (const t of types) {
        const id = Number(t.type.id);
        const value = String(t.type.name);
        const labelFr = t.labelFr ?? toFr(t.type.name);
        if (!byValue.has(value)) byValue.set(value, { id, value, labelFr });
      }

      const list = [...byValue.values()].sort((a, b) =>
        a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
      );

      setTypes(list);
    } catch (err) {
      console.error('Erreur lors de la récupération des types', err);
    }
  }

  useEffect(() => {
    fetchAttacks();
    fetchTypes();
  }, []);

  const handleAddClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = () => {
    fetchAttacks(nameFilter, typeFilter);
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleAttackSaved = () => {
    fetchAttacks(nameFilter, typeFilter);
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
