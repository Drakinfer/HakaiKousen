'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import TalentTable from '../components/TalentsTable';
import TalentFilter from '../components/filters/TalentFilters';
import Loading from '../components/Loading';
import { fetchTalents } from '@/lib/fetch';

export default function TalentsPage() {
  const [talents, setTalents] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTalents(setTalents, setLoading);
  }, []);

  const handleSearch = () => {
    fetchTalents(setTalents, setLoading, nameFilter);
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-center p-1 h-main-footer">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-1 mt-1">
          Liste des Talents
        </h1>
        <div className="w-full max-w-4xl mb-4">
          <TalentFilter
            name={nameFilter}
            onNameChange={setNameFilter}
            onSearch={handleSearch}
          />
        </div>
        <TalentTable talents={talents} basePath={'/talents'} />
      </div>
      <Footer />
    </>
  );
}
