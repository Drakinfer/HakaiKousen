'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import AttacksTable from '../components/AttacksTable';

export default function AttacksPage() {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAttacks() {
    try {
      setLoading(true);
      const response = await fetch(`/api/attacks`);
      const data = await response.json();
      if (response.ok) {
        setAttacks(data.attacks);
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
    fetchAttacks();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center p-1 h-[calc(100vh-4rem)]">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center mb-5 mt-1">
          Liste des Attaques
        </h1>

        <AttacksTable attacks={attacks} />
      </div>
      <Footer />
    </>
  );
}
