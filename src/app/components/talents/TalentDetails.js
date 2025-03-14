import { useState } from 'react';

export default function TalentDetails({ talent, generations }) {
  const [selectedGeneration, setSelectedGeneration] = useState(generations[0]);

  const selectedTalentGeneration = talent.talents_generations.find(
    (gen) => gen.generations.name === selectedGeneration,
  );

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
        {selectedTalentGeneration ? (
          <>
            <p className="text-lg font-bold text-center">Description </p>
            <p className="text-center">
              {selectedTalentGeneration.description}
            </p>
          </>
        ) : (
          <p className="text-center">Pas de description disponible</p>
        )}
      </div>
    </div>
  );
}
