'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';

export default function TeamFormModal({
  isOpen,
  onClose,
  member,
  onSaved,
  users
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    pseudoId: '',
    role: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    if (member) {
      setForm({
        pseudoId: member. pseudoId || '',
        role: member.role || '',
      });
    } else {
      setForm({ pseudoId: '', role: '' });
      setError(null);
    }
  }, [member, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.pseudoId) {
      setError('Le membre est obligatoire.');
      return;
    }

    if (!form.role.trim()) {
      setError('Le role est obligatoire.');
      return;
    }

    const payload = {
      pseudoId: form.pseudoId,
      role: form.role.trim(),
    };

    try {
      setSaving(true);

      const url = member
        ? `/api/teams/${member.id}`
        : '/api/teams';
      const method = member ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de l’enregistrement du membre",
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
      title={member ? 'Modifier un membre' : 'Ajouter un membre'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="name">
            Membre *
          </label>
          <select
  id="pseudoId"
  name="pseudoId"
  className="border rounded px-2 py-1 text-sm"
  value={form.pseudoId}
  onChange={handleChange}
  required
>
  <option value="">— Sélectionner un utilisateur —</option>

  {users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name || user.email}
    </option>
  ))}
</select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="description">
           Role*
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className="border rounded px-2 py-1 text-sm"
            value={form.role}
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
              : member
                ? 'Modifier'
                : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
