'use client';

export default function PokemonFilters({
  types,
  generations,
  searchMode,
  selectedTypes,
  nameFilter,
  firstGen,
  showFilters,
  onNameChange,
  onFirstGenChange,
  onSearchModeChange,
  onToggleType,
  onSubmit,
}) {
  return (
    <div
      className={`w-full lg:w-1/3 p-4 bg-white mb-1 rounded-lg ${
        showFilters ? 'block' : 'hidden lg:block'
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Filtres</h2>

      {/* Filtre par nom */}
      <div className="mb-4">
        <label
          htmlFor="nameFilter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nom
        </label>
        <input
          id="nameFilter"
          type="text"
          value={nameFilter}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex : Pikachu"
          className="w-full border p-2 rounded-md"
        />
      </div>

      {/* Filtre par première génération */}
      <div className="mb-4">
        <label
          htmlFor="firstGen"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Première génération
        </label>
        <select
          id="firstGen"
          value={firstGen}
          onChange={(e) => onFirstGenChange(e.target.value)}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Toutes les générations</option>
          {generations.map((gen) => (
            <option key={gen.id} value={gen.id}>
              {gen.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par type */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par Type</label>

      <div className="mb-4">
        <select
          value={searchMode}
          onChange={(e) => onSearchModeChange(e.target.value)}
          className="w-full border p-2 rounded-md"
        >
          <option value="any">Un seul de ces types</option>
          <option value="exact">Seulement ces types (max 2)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
        {types.map((type) => (
          <div key={type.value} className="flex items-center">
            <input
              type="checkbox"
              id={type.value}
              checked={selectedTypes.includes(type.value)}
              onChange={() => onToggleType(type.value)}
              className="mr-2"
              disabled={
                searchMode === 'exact' &&
                selectedTypes.length >= 2 &&
                !selectedTypes.includes(type.value)
              }
            />
            <label htmlFor={type.value} className="text-gray-700">
              {type.labelFr}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
      >
        Rechercher
      </button>
    </div>
  );
}
