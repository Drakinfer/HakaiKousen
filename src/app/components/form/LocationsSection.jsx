'use client';

import { Trash } from "../../../../lib/lucide";

export default function LocationsSection({
  locations,
  setLocations,
  locationsRef,
}) {
  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      { id: undefined, locationId: locationsRef[0]?.id ?? null },
    ]);
  };

  const updateLocation = (index, newValue) => {
    setLocations((prev) =>
      prev.map((l, i) => (i === index ? newValue : l)),
    );
  };

  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Localisations</h2>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-red-500 text-white"
          onClick={addLocation}
        >
          + Ajouter une localisation
        </button>
      </div>

      {locations.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucune localisation associée.
        </p>
      )}

      {locations.map((l, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_auto] gap-2 items-center"
        >
          <select
            className="border rounded px-2 py-1 text-sm"
            value={l.locationId ?? ''}
            onChange={(e) =>
              updateLocation(index, {
                ...l,
                locationId:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          >
            <option value="">— Choisir une localisation —</option>
            {locationsRef.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <Trash onClick={() => removeLocation(index)} color='red' />
        </div>
      ))}
    </div>
  );
}
