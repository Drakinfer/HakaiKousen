'use client';

import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import TalentForm from '../form/TalentForm';
import { fetchGenerations } from '@/lib/fetch';
import Loading from '../Loading';

export default function TalentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTalent = null,
}) {
  const title = initialTalent ? 'Modifier un talent' : 'Créer un talent';
  const [generations, setGenerations] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (payload) => {
    await onSubmit(payload);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadGenerations = async () => {
      try {
        let g= await fetchGenerations();
        setGenerations(g)
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des générations");
      }
    };

    loadGenerations();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      {localLoading && (
        <Loading/>
      )}

      {!localLoading && (
        <TalentForm
          initialTalent={initialTalent}
          generations={generations}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
