'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';

export default function GenerationFormModal({
  isOpen,
  onClose,
  generation,
  onSaved,
}) {
  const isEditMode = !!generation;
  const [name, setName] = useState(generation?.name || '');
  const [rank, setRank] = useState(generation?.rank || 10)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(generation?.name || '');
    setRank(generation?.rank || 10);
    setError('');
  }, [generation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditMode
        ? `/api/generations/${generation.id}`
        : '/api/generations';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, rank }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ||
            `Erreur lors de la ${
              isEditMode ? 'mise à jour' : 'création'
            } de la génération`,
        );
      }

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Modifier une génération' : 'Ajouter une génération'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nom de la génération
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rang
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm border rounded"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:opacity-60"
            disabled={saving}
          >
            {saving
              ? isEditMode
                ? 'Mise à jour...'
                : 'Création...'
              : isEditMode
              ? 'Enregistrer'
              : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
