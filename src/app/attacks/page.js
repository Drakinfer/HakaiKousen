'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import AttacksTable from '../components/AttacksTable';
import AttacksFilter from '../components/filters/AttackFilters';
import { toFr } from '@/lib/types';
import { fetchAttacks, fetchTypes } from '@/lib/fetch';

export default function AttacksPage() {
  const [attacks, setAttacks] = useState([]);
  const [types, setTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let a = await fetchAttacks(nameFilter, typeFilter);
        setAttacks(a);
        let t = await fetchTypes();
        const uniqueSortedTypes = [
          ...new Map(t.map((type) => [type.value, type])).values(),
        ].sort((a, b) =>
          a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
        );
        setTypes(uniqueSortedTypes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSearch = async () => {
    let a = await fetchAttacks(nameFilter, typeFilter);
    setAttacks(a);
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-center p-1 h-main-footer">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-1 mt-1">
          Liste des Attaques
        </h1>

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

        <AttacksTable attacks={attacks} basePath={'/attacks'} />
      </div>
      <Footer />
    </>
  );
}
