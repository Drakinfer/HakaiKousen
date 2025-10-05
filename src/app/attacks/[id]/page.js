'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import AttackDetails from '@/app/components/attacks/AttackDetails';

export default function AttackPage() {
  const { id } = useParams();
  const [attack, setAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generations, setGenerations] = useState([]);
  const actions = [{ href: '/attacks', icon: faArrowLeft, title: 'Retour' }];

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchAttack() {
      setLoading(true);
      try {
        const res = await fetch(`/api/attacks/${id}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error || "Erreur lors du chargement de l'attack",
          );
        }

        const a = data.attaque;
        const list = Array.isArray(a?.attaqueGenerations)
          ? a.attaqueGenerations
          : [];

        const uniqueGenerations = [
          ...new Set(
            list
              .map((g) => g?.Generation?.name ?? g?.generation?.name)
              .filter(Boolean),
          ),
        ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

        if (!cancelled) {
          setAttack(a);
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

    fetchAttack();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-[calc(100vh-4rem)]  ">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{attack.name}</h1>
        <AttackDetails attack={attack} generations={generations} />
      </div>
    </div>
  );
}
