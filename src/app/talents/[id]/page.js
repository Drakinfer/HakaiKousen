'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import TalentDetails from '@/app/components/talents/TalentDetails';

export default function TalentPage() {
  const { id } = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generations, setGenerations] = useState([]);
  const actions = [{ href: '/talents', icon: faArrowLeft, title: 'Retour' }];

  useEffect(() => {
    async function fetchTalent() {
      try {
        const response = await fetch(`/api/talents/${id}`);
        const data = await response.json();

        if (response.ok) {
          const talentData = data.talent;

          const uniqueGenerations = Array.from(
            new Set(
              talentData.talents_generations.map((gen) => gen.generations.name),
            ),
          ).sort();

          setTalent(talentData);
          setGenerations(uniqueGenerations);
        } else {
          setError(data.error || 'Erreur lors du chargement du Talent');
        }
      } catch (err) {
        setError("Erreur de connexion à l'API");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTalent();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-[calc(100vh-4rem)]  ">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{talent.name}</h1>
        <TalentDetails talent={talent} generations={generations} />
      </div>
    </div>
  );
}
