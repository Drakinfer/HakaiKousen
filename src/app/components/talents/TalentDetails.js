import { useState, useEffect } from 'react';

export default function TalentDetails({ talent, generations = [] }) {
  const [selectedGeneration, setSelectedGeneration] = useState(
    generations[0] ?? null,
  );

  useEffect(() => {
    if (!generations.length) {
      setSelectedGeneration(null);
      return;
    }

    if (!selectedGeneration || !generations.includes(selectedGeneration)) {
      setSelectedGeneration(generations[0]);
    }
  }, [generations, selectedGeneration]);

  const tgList = Array.isArray(talent?.talentGenerations)
    ? talent.talentGenerations
    : [];

  const selectedTalentGeneration =
    tgList.find((tg) => tg?.generation?.name === selectedGeneration) || null;

  return (
    <div className="w-full bg-white">
      <div className="flex border-b pb-2 mt-3 overflow-x-auto space-x-2">
        {generations.map((genName) => (
          <button
            key={genName}
            onClick={() => setSelectedGeneration(genName)}
            className={`flex-grow px-4 py-2 text-sm font-semibold rounded-t-md text-center max-w-[200px] ${
              selectedGeneration === genName
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {genName}
          </button>
        ))}
      </div>

      <div className="w-full p-4 bg-white">
        {selectedTalentGeneration ? (
          <>
            <p className="text-lg font-bold text-center">Description</p>
            <p className="text-center">
              {selectedTalentGeneration.description || 'Pas de description'}
            </p>
          </>
        ) : (
          <p className="text-center">Pas de description disponible</p>
        )}
      </div>
    </div>
  );
}
