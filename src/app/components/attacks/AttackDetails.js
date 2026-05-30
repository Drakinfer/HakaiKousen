import { useState, useEffect } from 'react';
import { toFr } from '@/lib/types';
import { CATEGORY } from '@/lib/category';
import { RANGE } from '@/lib/range';

export default function AttackDetails({ attack, generations = [] }) {
  const agList = Array.isArray(attack?.attaqueGenerations)
    ? attack.attaqueGenerations
    : [];

  const [selectedGeneration, setSelectedGeneration] = useState(
    generations.length ? generations[generations.length - 1] : null,
  );

  useEffect(() => {
    if (!generations.length) {
      setSelectedGeneration(null);
      return;
    }

    if (!selectedGeneration || !generations.includes(selectedGeneration)) {
      setSelectedGeneration(generations[generations.length - 1]);
    }
  }, [generations, selectedGeneration, attack?.id]);

  let selectedAttackGeneration =
    agList.find((gen) => {
      const genName = gen.generation?.name ?? gen.Generation?.name;
      return genName === selectedGeneration;
    }) || null;

  if (!selectedAttackGeneration && agList.length) {
    const withGen = agList.filter((g) => g.generation || g.Generation);

    if (withGen.length) {
      const best = withGen.reduce((best, g) => {
        const gen = g.generation || g.Generation;
        const currentRank = gen?.rank ?? 0;

        if (!best) return g;

        const bestGen = best.generation || best.Generation;
        const bestRank = bestGen?.rank ?? 0;

        return currentRank > bestRank ? g : best;
      }, null);

      selectedAttackGeneration = best;
    } else {
      selectedAttackGeneration = agList[0];
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="flex border-b pb-2 mt-3 overflow-x-auto space-x-2">
        {generations.map((gen) => (
          <button
            key={gen}
            onClick={() => setSelectedGeneration(gen)}
            className={`flex-grow px-4 py-2 text-sm font-semibold rounded-t-md text-center max-w-[200px] ${
              selectedGeneration === gen
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {gen}
          </button>
        ))}
      </div>

      <div className="w-full p-4 bg-white">
        {selectedAttackGeneration ? (
          <table className="w-full p-4 bg-white">
            <thead>
              <tr>
                <th>Type</th>
                <th>Énergie Système de base</th>
                <th>Énergie Système remanié</th>
                <th>Précision</th>
                <th>Portée</th>
                <th>Catégorie</th>
                <th>Dégâts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-md ${
                      selectedAttackGeneration?.type?.name?.toLowerCase() || ''
                    } border-2 border-black`}
                  >
                    {toFr(selectedAttackGeneration?.type?.name) || ''}
                  </span>
                </td>

                <td className="p-2 text-center">
                  {selectedAttackGeneration?.energie1}
                </td>
                <td className="p-2 text-center">
                  {selectedAttackGeneration?.energie2}
                </td>

                <td className="p-2 text-center">
                  {selectedAttackGeneration?.precision ?? '-'}
                </td>

                <td className="p-2 text-center">
                  {RANGE[selectedAttackGeneration?.range] ?? ''}
                </td>

                <td className="p-2 text-center">
                  {CATEGORY[selectedAttackGeneration?.category] ?? ''}
                </td>

                <td className="p-2 text-center">
                  {selectedAttackGeneration?.damage_base ?? 0}
                </td>
              </tr>
              <tr>
                <th className="p-2 text-center" colSpan={7}>
                  Description
                </th>
              </tr>
              <tr>
                <td className="p-2 text-center" colSpan={7}>
                  {selectedAttackGeneration.description}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          "Pas d'information disponible"
        )}
      </div>
    </div>
  );
}
