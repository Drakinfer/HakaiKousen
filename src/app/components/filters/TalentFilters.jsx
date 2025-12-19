'use client';

export default function TalentFilter({ name, onNameChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="talentNameFilter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filtrer par nom
        </label>
        <input
          id="talentNameFilter"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex : Intimidation"
          className="w-full border p-2 rounded-md"
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="sm:w-40 w-full bg-red-500 text-white font-medium py-2 px-4 rounded-md"
      >
        Rechercher
      </button>
    </div>
  );
}
