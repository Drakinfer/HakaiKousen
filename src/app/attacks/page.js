'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import AttacksTable from '../components/AttacksTable';
import AttacksFilter from '../components/filters/AttackFilters';
import { toFr } from '@/lib/types';

export default function AttacksPage() {
  const [attacks, setAttacks] = useState([]);
  const [types, setTypes] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

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
        const value = String(t.name);
        const labelFr = t.labelFr ?? toFr(t.name);
        if (!byValue.has(value)) byValue.set(value, { value, labelFr });
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

  const handleSearch = () => {
    fetchAttacks(nameFilter, typeFilter);
  };

  return (
    <>
      <div className="flex flex-col items-center p-1 h-main-footer">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-5 mt-1">
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

        <AttacksTable attacks={attacks} />
      </div>
      <Footer />
    </>
  );
}
