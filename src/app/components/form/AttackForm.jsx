'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { RANGE } from '@/lib/range';
import { CATEGORY } from '@/lib/category';

function createEmptyGenerationRow() {
  return {
    generationId: '',
    typeId: '',
    energie1: '',
    energie2: '',
    category: 'PHYSIQUE',
    range: 'CIBLE',
    precision: '',
    damage_base: '',
    description: '',
  };
}

export default function AttackForm({
  types,
  generations,
  onSuccess,
  mode = 'create', 
  attack = null,
}) {
  const isEdit = mode === 'edit' && !!attack;

  const [name, setName] = useState('');
  const [attackGenerations, setAttackGenerations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && attack) {
      setName(attack.name || '');

      const mapped = (attack.attaqueGenerations || []).map((g) => ({
        generationId: g.generationId != null ? String(g.generationId) : '',
        typeId: g.typeId != null ? String(g.typeId) : '',
        energie1: g.energie1 != null ? String(g.energie1) : '',
        energie2: g.energie2 != null ? String(g.energie2) : '',
        category: g.category || 'PHYSIQUE',
        range: g.range || 'CIBLE',
        precision: g.precision != null ? String(g.precision) : '',
        damage_base: g.damage_base != null ? String(g.damage_base) : '',
        description: g.description || '',
      }));

      setAttackGenerations(mapped);
    } else if (!isEdit) {
      setName('');
      setAttackGenerations([]);
    }
  }, [isEdit, attack]);

  const handleAddGeneration = () => {
    setAttackGenerations((prev) => [...prev, createEmptyGenerationRow()]);
  };

  const handleRemoveGeneration = (index) => {
    setAttackGenerations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerationChange = (index, field, value) => {
    setAttackGenerations((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Le nom de l’attaque est obligatoire.");
      return;
    }

    const formattedGenerations = attackGenerations
      .filter((row) => row.generationId && row.typeId)
      .map((row) => ({
        generationId: Number(row.generationId),
        typeId: Number(row.typeId),
        energie1: Number(row.energie1) || 0,
        energie2: row.energie2 ? Number(row.energie2) : null,
        category: row.category,
        range: row.range,
        precision: Number(row.precision) || 0,
        damage_base: Number(row.damage_base) || 0,
        description: (row.description || '').trim(),
      }));

    const payload = {
      name: name.trim(),
      attaqueGenerations: formattedGenerations,
    };

    if (typeof onSuccess === 'function') {
      onSuccess(payload);
    }

    if (!isEdit) {
      setName('');
      setAttackGenerations([]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] pr-1"
    >
      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nom de l’attaque
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Ex : Lance-Flammes"
        />
      </div>

      <div className="flex items-center justify-between mt-4 mb-1">
        <h2 className="text-sm font-semibold text-gray-800">
          Variantes par génération (AttaqueGeneration)
        </h2>
        <button
          type="button"
          onClick={handleAddGeneration}
          className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold px-2 py-1 rounded"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
          Ajouter une génération
        </button>
      </div>

      <div className="space-y-3">
        {attackGenerations.map((row, index) => (
          <div
            key={index}
            className="border rounded-md p-3 space-y-2 bg-gray-50 relative"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-700">
                AttaqueGeneration #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveGeneration(index)}
                className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                Supprimer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Génération
                </label>
                <select
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={row.generationId || ''}
                  onChange={(e) =>
                    handleGenerationChange(index, 'generationId', e.target.value)
                  }
                >
                  <option value="">— Sélectionner —</option>
                  {generations.map((gen) => (
                    <option key={gen.id} value={gen.id}>
                      {gen.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={row.typeId || ''}
                  onChange={(e) =>
                    handleGenerationChange(index, 'typeId', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">— Sélectionner —</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.labelFr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Énergie 1
                </label>
                <input
                  type="number"
                  value={row.energie1}
                  onChange={(e) =>
                    handleGenerationChange(index, 'energie1', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Énergie 2 (optionnel)
                </label>
                <input
                  type="number"
                  value={row.energie2}
                  onChange={(e) =>
                    handleGenerationChange(index, 'energie2', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={row.category}
                  onChange={(e) =>
                    handleGenerationChange(index, 'category', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Object.entries(CATEGORY).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Portée
                </label>
                <select
                  value={row.range}
                  onChange={(e) =>
                    handleGenerationChange(index, 'range', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Object.entries(RANGE).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Précision
                </label>
                <input
                  type="number"
                  value={row.precision}
                  step="5"
                  onChange={(e) =>
                    handleGenerationChange(index, 'precision', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Dégâts de base
                </label>
                <input
                  type="number"
                  value={row.damage_base}
                  onChange={(e) =>
                    handleGenerationChange(index, 'damage_base', e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={row.description}
                onChange={(e) =>
                  handleGenerationChange(index, 'description', e.target.value)
                }
                className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
        >
          {isEdit ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
