'use client';
import { Trash } from "../../../../lib/lucide";

export default function CompetencesSection({
  competences,
  setCompetences,
  competencesRef,
}) {
  const addCompetence = () => {
    setCompetences((prev) => [
      ...prev,
      { id: undefined, competenceId: null, points: 0 },
    ]);
  };

  const updateCompetence = (index, newValue) => {
    setCompetences((prev) =>
      prev.map((c, i) => (i === index ? newValue : c)),
    );
  };

  const removeCompetence = (index) => {
    setCompetences((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Compétences</h2>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-red-500 text-white"
          onClick={addCompetence}
        >
          + Ajouter une compétence
        </button>
      </div>

      {competences.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucune compétence liée à ce Pokémon.
        </p>
      )}

      {competences.map((c, index) => (
        <div
          key={index}
        className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_auto] gap-2 items-center"
        >
          <div>
          <label className="block text-xs mb-1">
            Nom
          </label>
          <select
            className="border rounded px-2 py-1 text-sm w-full"
            value={c.competenceId ?? ''}
            onChange={(e) =>
              updateCompetence(index, {
                ...c,
                competenceId:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          >
            <option value="">— Choisir une compétence —</option>
            {competencesRef.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>
          </div>
          

          <div>
            <label className="block text-xs mb-1">Points</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              value={c.points ?? 0}
              onChange={(e) =>
                updateCompetence(index, {
                  ...c,
                  points: Number(e.target.value),
                })
              }
            />
          </div>

          <Trash onClick={() => removeCompetence(index)} color="red" />
        </div>
      ))}
    </div>
  );
}
