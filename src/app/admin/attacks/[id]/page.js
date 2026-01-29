'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  faArrowLeft,
  faSquarePen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import AttackDetails from '@/app/components/attacks/AttackDetails';
import AttackFormModal from '@/app/components/modal/AttackFormModal';
import { fetchAttack } from '@/lib/fetch';
import { useSession } from 'next-auth/react';

export default function AttackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [attack, setAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchAttack(id);

        setAttack(result.attack);
        setGenerations(result.generations);
        setSelectedGeneration(result.selectedGeneration);
      } catch (e) {
        console.error('Erreur lors du chargement de l’attaque', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSubmitEdit = async (payload) => {
    try {
      const res = await fetch(`/api/attacks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();

      if (!res.ok) {
        console.error('Erreur API PUT /api/attacks/[id] :', rawText);
        alert("Erreur lors de la mise à jour de l'attaque");
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error(
          'Réponse JSON invalide pour PUT /api/attacks/[id] :',
          rawText,
        );
        alert("Réponse serveur invalide lors de la mise à jour de l'attaque");
        return;
      }

      const a = data.attack;

      setAttack(a);

      if (a?.attaqueGenerations) {
        const list = Array.isArray(a.attaqueGenerations)
          ? a.attaqueGenerations
          : [];

        const uniqueGenerations = [
          ...new Set(
            list
              .map((g) => g?.Generation?.name ?? g?.generation?.name)
              .filter(Boolean),
          ),
        ].sort((x, y) => x.localeCompare(y, 'fr', { numeric: true }));

        setGenerations(uniqueGenerations);
      } else {
        console.warn(
          'ATTENTION : a.attaqueGenerations est undefined/null, les onglets seront vides.',
        );
        setGenerations([]);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'attaque", error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      'Es-tu sûr de vouloir supprimer cette attaque ? Cette action est irréversible.',
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/attacks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API delete:', errorText);
        alert('La suppression a échoué.');
        return;
      }

      router.push('/admin/attacks');
    } catch (error) {
      console.error("Erreur lors de la suppression de l'attaque", error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  const actions = [
    { href: '/admin/attacks', icon: faArrowLeft, title: 'Retour' },
    { onClick: handleEditClick, icon: faSquarePen, title: 'Modifier' },
    {
      onClick: handleDeleteClick,
      icon: faTrash,
      title: 'Supprimer',
      adminOnly: true,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!attack) {
    return (
      <div className="flex h-main">
        <Aside actions={actions} isAdmin={isAdmin} />
        <div className="w-full p-1 overflow-hidden">
          <p className="text-center mt-4 text-red-600">Attaque introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-main">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{attack.name}</h1>
        <AttackDetails attack={attack} generations={generations} />
      </div>

      {isEditModalOpen && (
        <AttackFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onAttackSaved={handleSubmitEdit}
          attack={attack}
        />
      )}
    </div>
  );
}
