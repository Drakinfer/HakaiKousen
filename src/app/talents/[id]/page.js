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
    if (!id) return;

    let cancelled = false;

    async function fetchTalent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/talents/${id}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Erreur lors du chargement du Talent');
        }

        const t = data.talent;
        const list = Array.isArray(t?.talentGenerations)
          ? t.talentGenerations
          : [];

        const uniqueGenerations = [
          ...new Set(
            list
              .map((g) => g?.Generation?.name ?? g?.generation?.name)
              .filter(Boolean),
          ),
        ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

        if (!cancelled) {
          setTalent(t);
          setGenerations(uniqueGenerations);
          if (
            typeof setSelectedGeneration === 'function' &&
            uniqueGenerations.length
          ) {
            setSelectedGeneration(uniqueGenerations[0]);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Erreur de connexion à l'API");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTalent();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-main">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{talent.name}</h1>
        <TalentDetails talent={talent} generations={generations} />
      </div>
    </div>
  );
}
