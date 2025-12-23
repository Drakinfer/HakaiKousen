'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';

export default function CompetenceFormModal({
  isOpen,
  onClose,
  competence,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    if (competence) {
      setForm({
        name: competence.name || '',
        description: competence.description || '',
      });
    } else {
      setForm({ name: '', description: '' });
      setError(null);
    }
  }, [competence, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Le nom est obligatoire.');
      return;
    }
    if (!form.description.trim()) {
      setError('La description est obligatoire.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    try {
      setSaving(true);

      const url = competence
        ? `/api/competences/${competence.id}`
        : '/api/competences';
      const method = competence ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || 'Erreur lors de l’enregistrement de la compétence',
        );
      }

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur inattendue');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={competence ? 'Modifier une compétence' : 'Ajouter une compétence'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="border rounded px-2 py-1 text-sm"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded px-2 py-1 text-sm min-h-[120px]"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

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
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-70"
            disabled={saving}
          >
            {saving
              ? 'Enregistrement...'
              : competence
                ? 'Modifier'
                : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
