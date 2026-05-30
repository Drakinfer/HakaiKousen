'use client';

import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';
import { toFr } from '@/lib/types';
import { fetchGenerations } from '@/lib/fetch';

const FLOAT_FIELDS = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
];

function parseFloatOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const num = parseFloat(value);
  return Number.isNaN(num) ? null : num;
}

export default function TypeFormModal({ isOpen, onClose, type, onSaved }) {
  const [generations, setGenerations] = useState([]);
  const [loadingGenerations, setLoadingGenerations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    generationId: '',
    bug: '',
    dark: '',
    dragon: '',
    electric: '',
    fairy: '',
    fighting: '',
    fire: '',
    flying: '',
    ghost: '',
    grass: '',
    ground: '',
    ice: '',
    normal: '',
    poison: '',
    psychic: '',
    rock: '',
    steel: '',
    water: '',
  });

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

  useEffect(() => {
    if (!isOpen) return;

    if (type) {
      const initial = {
        name: type.name || '',
        generationId: type.generationId?.toString() || '',
      };

      FLOAT_FIELDS.forEach((field) => {
        initial[field] =
          type[field] === null || type[field] === undefined
            ? ''
            : String(type[field]);
      });

      setForm(initial);
    } else {
      setForm({
        name: '',
        generationId: '',
        bug: '',
        dark: '',
        dragon: '',
        electric: '',
        fairy: '',
        fighting: '',
        fire: '',
        flying: '',
        ghost: '',
        grass: '',
        ground: '',
        ice: '',
        normal: '',
        poison: '',
        psychic: '',
        rock: '',
        steel: '',
        water: '',
      });
      setError(null);
    }
  }, [type, isOpen]);

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
    if (!form.generationId) {
      setError('La génération est obligatoire.');
      return;
    }

    const NULLABLE_FIELDS = ['dark', 'fairy', 'steel'];
    const REQUIRED_FIELDS = FLOAT_FIELDS.filter(
      (f) => !NULLABLE_FIELDS.includes(f),
    );

const payload = {
  name: form.name.trim(),
  generationId: Number(form.generationId),
};

for (const field of REQUIRED_FIELDS) {
  const val = parseFloatOrNull(form[field]);
  if (val === null) {
    return setError(`La sensibilité "${toFr(field)}" est obligatoire.`);
  }
  payload[field] = val;
}

for (const field of NULLABLE_FIELDS) {
  payload[field] = parseFloatOrNull(form[field]);
}

    try {
      setSaving(true);

      const url = type ? `/api/types/${type.id}` : '/api/types';
      const method = type ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement du type');
      }

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur inattendue');
    } finally {
      setSaving(false);
    }
  };

  const sortedFields = [...FLOAT_FIELDS].sort((a, b) => {
  const labelA = toFr(a).toLowerCase();
  const labelB = toFr(b).toLowerCase();
  return labelA.localeCompare(labelB);
});


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type ? 'Modifier un type' : 'Ajouter un type'}
      size = "xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
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
          <label className="text-sm font-semibold" htmlFor="generationId">
            Génération
          </label>
          <select
            id="generationId"
            name="generationId"
            className="border rounded px-2 py-1 text-sm"
            value={form.generationId}
            onChange={handleChange}
            required
            disabled={loadingGenerations}
          >
            <option value="">-- Sélectionne une génération --</option>
            {generations.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name ?? `Génération ${g.id}`}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="border rounded p-3">
          <legend className="text-sm font-semibold px-1">
            Sensibilitées par type
          </legend>
          <p className="text-xs text-gray-500 mb-2">
            Utilise par exemple 0, 0.5, 1, 2… (laisser vide pour null).
          </p>

          <div className="grid md:grid-cols-6 grid-cols-3 gap-3 text-sm">
  {sortedFields.map((field) => (
    <div key={field} className="flex flex-col gap-1">
      <label className="capitalize" htmlFor={field}>
        {toFr(field)}
      </label>
      <input
        id={field}
        name={field}
        type="number"
        step="0.5"
        min="0"
        max="2"
        className="border rounded px-2 py-1 text-sm"
        value={form[field]}
        onChange={handleChange}
      />
    </div>
  ))}
</div>

        </fieldset>

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
            {saving ? 'Enregistrement...' : type ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
