'use client';

export default function AttacksFilter({
  name,
  typeId,
  types,
  onNameChange,
  onTypeChange,
  onSearch,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="attackNameFilter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filtrer par nom
        </label>
        <input
          id="attackNameFilter"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex : Tonnerre"
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="attackTypeFilter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Type
        </label>
        <select
          id="attackTypeFilter"
          value={typeId}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Tous les types</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.labelFr}
            </option>
          ))}
        </select>
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
