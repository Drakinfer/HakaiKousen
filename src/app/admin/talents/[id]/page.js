'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  faArrowLeft,
  faTrash,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import TalentDetails from '@/app/components/talents/TalentDetails';
import { fetchTalent } from '@/lib/fetch';
import TalentFormModal from '@/app/components/modal/TalentFormModal';

export default function AdminTalentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          router.push('/admin/talents');
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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSubmitEdit = async (payload) => {
    try {
      const res = await fetch(`/api/talents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('Erreur API', await res.text());
        alert('Erreur lors de la mise à jour du talent');
        return;
      }

      const data = await res.json();
      const t = data.talent;

      setTalent(t);

      if (t?.talentGenerations) {
        const list = Array.isArray(t.talentGenerations)
          ? t.talentGenerations
          : [];

        const uniqueGenerations = [
          ...new Set(
            list
              .map((g) => g?.Generation?.name ?? g?.generation?.name)
              .filter(Boolean),
          ),
        ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

        setGenerations(uniqueGenerations);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du talent', error);
      alert('Erreur lors de la mise à jour du talent');
    }
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      'Es-tu sûr de vouloir supprimer ce talent ? Cette action est irréversible.',
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/talents/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API delete:', errorText);
        alert('La suppression a échoué.');
        return;
      }

      router.push('/admin/talents');
    } catch (error) {
      console.error('Erreur lors de la suppression du talent', error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  const actions = [
    { href: '/admin/talents', icon: faArrowLeft, title: 'Retour' },
    { onClick: handleEditClick, icon: faSquarePen, title: 'Modifier' },
    { onClick: handleDeleteClick, icon: faTrash, title: 'Supprimer' },
  ];

  return (
    <div className="flex h-main">
      <Aside actions={actions} />
      <div className="w-full p-1 overflow-hidden">
        <h1 className="w-full text-center font-bold text-2xl">{talent.name}</h1>
        <TalentDetails talent={talent} generations={generations} />
      </div>

      {isEditModalOpen && (
        <TalentFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEdit}
          initialTalent={talent}
        />
      )}
    </div>
  );
}
