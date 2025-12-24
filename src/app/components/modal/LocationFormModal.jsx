'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';

export default function CompetenceFormModal({
  isOpen,
  onClose,
  location,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    icon: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    if (location) {
      setForm({
        name: location.name || '',
        icon: location.icon || '',
      });
    } else {
      setForm({ name: '', icon: '' });
      setError(null);
    }
  }, [location, isOpen]);

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

    const payload = {
      name: form.name.trim(),
      icon: form.icon.trim(),
    };

    try {
      setSaving(true);

      const url = location
        ? `/api/locations/${location.id}`
        : '/api/locations';
      const method = location ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de l’enregistrement de l'habitat",
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
      title={location ? 'Modifier un habitat' : 'Ajouter un habitat'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="name">
            Nom *
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
            Icone (voir Lucide Icon - optionnel) 
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            className="border rounded px-2 py-1 text-sm"
            value={form.icon}
            onChange={handleChange}
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
              : location
                ? 'Modifier'
                : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
