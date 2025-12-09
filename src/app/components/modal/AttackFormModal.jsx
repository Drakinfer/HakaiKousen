'use client';

import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import AttackForm from '@/app/components/form/AttackForm';
import { fetchGenerations, fetchTypes } from '@/lib/fetch';
import Loading from '../Loading';

export default function AttackFormModal({
  isOpen,
  onClose,
  onAttackSaved,
  attack = null,
}) {
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setLocalLoading(true);
        await fetchGenerations(setGenerations, () => {});
        await fetchTypes(setTypes);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          alert('Erreur lors du chargement des types ou des générations');
        }
      } finally {
        if (!cancelled) {
          setLocalLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEdit = !!attack;

  const handleSuccess = async (payload) => {
    if (typeof onAttackSaved === 'function') {
      await onAttackSaved(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Modifier l'attaque ${attack.name}` : 'Ajouter une attaque'}
    >
      {localLoading ? (
        <Loading />
      ) : (
        <AttackForm
          types={types}
          generations={generations}
          mode={isEdit ? 'edit' : 'create'}
          attack={attack}
          onSuccess={handleSuccess}
        />
      )}
    </Modal>
  );
}
