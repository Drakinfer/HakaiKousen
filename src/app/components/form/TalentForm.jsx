'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TalentForm({
  initialTalent = null,
  generations = [],
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(initialTalent?.name || '');
  const [talentGenerations, setTalentGenerations] = useState(
    initialTalent?.talentGenerations?.map((tg) => ({
      id: tg.id ?? null,
      generationId: tg.generationId,
      description: tg.description || '',
    })) || []
  );

  const handleAddGeneration = () => {
    setTalentGenerations((prev) => [
      ...prev,
      { id: null, generationId: '', description: '' },
    ]);
  };

  const handleRemoveGeneration = (index) => {
    setTalentGenerations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerationChange = (index, field, value) => {
    setTalentGenerations((prev) =>
      prev.map((tg, i) =>
        i === index
          ? {
              ...tg,
              [field]: field === 'generationId' ? Number(value) || '' : value,
            }
          : tg
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedGenerations = talentGenerations.filter(
      (tg) =>
        tg.generationId &&
        String(tg.generationId).length > 0 &&
        tg.description.trim().length > 0
    );

    const payload = {
      id: initialTalent?.id ?? null,
      name: name.trim(),
      talentGenerations: cleanedGenerations,
    };

    onSubmit && onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 p-3 md:p-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du talent
        </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Descriptions par génération
          </span>
          <button
            type="button"
            onClick={handleAddGeneration}
            className="flex items-center text-xs px-2 py-1 border rounded hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Ajouter une génération
          </button>
        </div>

        {talentGenerations.length === 0 && (
          <p className="text-xs text-gray-500">
            Aucun détail de génération. Clique sur « Ajouter une génération » pour en créer un.
          </p>
        )}

        <div className="space-y-3">
          {talentGenerations.map((tg, index) => (
            <div
              key={tg.id ?? `new-${index}`}
              className="border rounded p-3 space-y-2 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  Génération
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveGeneration(index)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Supprimer
                </button>
              </div>

              <select
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                value={tg.generationId || ''}
                onChange={(e) =>
                  handleGenerationChange(index, 'generationId', e.target.value)
                }
              >
                <option value="">Sélectionner une génération</option>
                {generations.map((gen) => (
                  <option key={gen.id} value={gen.id}>
                    {gen.name}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={tg.description}
                  onChange={(e) =>
                    handleGenerationChange(
                      index,
                      'description',
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
          {initialTalent ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
