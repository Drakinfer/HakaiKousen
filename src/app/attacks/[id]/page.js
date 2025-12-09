'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import AttackDetails from '@/app/components/attacks/AttackDetails';
import { fetchAttack } from '@/lib/fetch';

export default function AttackPage() {
  const { id } = useParams();
  const [attack, setAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generations, setGenerations] = useState([]);
  const actions = [{ href: '/attacks', icon: faArrowLeft, title: 'Retour' }];

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchAttack(setAttack, setGenerations);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-main">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{attack.name}</h1>
        <AttackDetails attack={attack} generations={generations} />
      </div>
    </div>
  );
}
