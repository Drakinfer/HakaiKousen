'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import TalentDetails from '@/app/components/talents/TalentDetails';
import { fetchTalent } from '@/lib/fetch';

export default function TalentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState([]);
  const actions = [{ href: '/talents', icon: faArrowLeft, title: 'Retour' }];

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadTalent = async () => {
      try {
        setLoading(true);

        const { talent, generations } = await fetchTalent(id);
        if (cancelled) return;

        setTalent(talent);
        setGenerations(generations);

        if (!talent) {
          router.push('/talents');
          return;
        }
      } catch (e) {
        console.error(e);
        if (cancelled) return;
      } finally {
        setLoading(false);
      }
    };

    loadTalent();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) {
    return <Loading />;
  }

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
