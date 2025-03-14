'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import TalentTable from '../components/TalentsTable';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function TalentsPage() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTalents() {
    try {
      setLoading(true);
      const response = await fetch(`/api/talents`);
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

  return (
    <>
      <div className="flex flex-col items-center p-1 h-[calc(100vh-4rem)]">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-5 mt-1">
          Liste des Talents
        </h1>

        <TalentTable talents={talents} />
      </div>
      <Footer />
    </>
  );
}
