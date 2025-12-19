'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import TalentTable from '../components/TalentsTable';
import TalentFilter from '../components/filters/TalentFilters';
import Loading from '../components/Loading';

export default function TalentsPage() {
  const [talents, setTalents] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTalents(nameParam) {
    try {
      setLoading(true);
      setError(null);

      const effectiveName =
        typeof nameParam === 'string' ? nameParam : nameFilter;
      const params = new URLSearchParams();

      if (effectiveName.trim() !== '') {
        params.set('name', effectiveName.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/talents${queryString}`);
      const data = await response.json();

      if (response.ok) {
        setTalents(data.talents);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError("Erreur de connexion à l'API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleSearch = () => {
    fetchTalents(nameFilter);
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-center p-1 h-main-footer">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-5 mt-1">
          Liste des Talents
        </h1>
        <div className="w-full max-w-4xl mb-4">
          <TalentFilter
            name={nameFilter}
            onNameChange={setNameFilter}
            onSearch={handleSearch}
          />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <TalentTable talents={talents} />
      </div>
      <Footer />
    </>
  );
}
