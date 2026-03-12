'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';

export default function HomePageFormModal({ isOpen, onClose, paragraph, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    text: '',
    isNotification: false,
    rank: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (paragraph) {
      setForm({
        title: paragraph.title || '',
        text: paragraph.text || '',
        isNotification: Boolean(paragraph.isNotification),
        rank: Number.isFinite(paragraph.rank) ? paragraph.rank : 0,
      });
    } else {
      setForm({ title: '', text: '', isNotification: false, rank: 0 });
      setError(null);
    }
  }, [paragraph, isOpen]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'rank'
            ? value
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const rankNum =
      form.rank === '' || form.rank === null || form.rank === undefined
        ? 0
        : Number(form.rank);

    if (Number.isNaN(rankNum)) {
      setError('Le rank doit être un nombre.');
      return;
    }

    const payload = {
      title: form.title.trim() ? form.title.trim() : null,
      text: form.text.trim() ? form.text.trim() : null,
      isNotification: Boolean(form.isNotification),
      rank: rankNum,
    };

    if (!payload.title && !payload.text) {
      setError('Veuillez renseigner au moins un titre ou un texte.');
      return;
    }

    try {
      setSaving(true);

      const url = paragraph
        ? `/api/homepage/${paragraph.id}`
        : '/api/homepage';
      const method = paragraph ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l’enregistrement du contenu HomePage");
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
      title={paragraph ? 'Modifier un contenu HomePage' : 'Ajouter un contenu HomePage'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="title">
            Titre (optionnel)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="border rounded px-2 py-1 text-sm"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="text">
            Texte (optionnel)
          </label>
          <textarea
            id="text"
            name="text"
            rows={5}
            className="border rounded px-2 py-1 text-sm"
            value={form.text}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="rank">
            Rank (ordre d’affichage)
          </label>
          <input
            id="rank"
            name="rank"
            type="number"
            min={1}
            className="border rounded px-2 py-1 text-sm w-40"
            value={form.rank}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">
            Tri : notifications d’abord, puis rank croissant.
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input
            id="isNotification"
            name="isNotification"
            type="checkbox"
            checked={form.isNotification}
            onChange={handleChange}
          />
          <span className="text-sm font-semibold">
            Notification (affichée sous le logo)
          </span>
        </label>

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
            {saving ? 'Enregistrement...' : paragraph ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
