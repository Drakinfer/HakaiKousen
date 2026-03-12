'use client';

export default function SectionGeneralPokemon({
  pokemon,
  setPokemon,
  generations,
  types,
}) {
  const updateField = (field, value) => {
    setPokemon((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const mainPictureType = pokemon.mainPictureType || 'url';
  const miniPictureType = pokemon.miniPictureType || 'url';

  const handleMainPictureTypeChange = (type) => {
    setPokemon((prev) => ({
      ...prev,
      mainPictureType: type,
    }));
  };

  const handleMiniPictureTypeChange = (type) => {
    setPokemon((prev) => ({
      ...prev,
      miniPictureType: type,
    }));
  };

  const handleMainPictureFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPokemon((prev) => ({
      ...prev,
      mainPictureFile: file,
      mainPictureType: 'file',
    }));
  };

  const handleMiniPictureFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPokemon((prev) => ({
      ...prev,
      miniPictureFile: file,
      miniPictureType: 'file',
    }));
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold mb-1">
        Infos générales du Pokémon
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={pokemon.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie *</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={pokemon.category}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="Pokémon Souris, Pokémon Flamme..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Numéro Pokédex *
          </label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={pokemon.dexNumber}
            onChange={(e) => updateField('dexNumber', e.target.value)}
            placeholder="025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Génération principale
          </label>
          <select
            className="w-full border rounded px-2 py-1"
            value={pokemon.firstGenerationId ?? ''}
            onChange={(e) =>
              updateField(
                'firstGenerationId',
                e.target.value === '' ? null : Number(e.target.value),
              )
            }
          >
            <option value="">— Aucune —</option>
            {generations.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name ?? g.romanNumber ?? `Gen ${g.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image principale *
          </label>

          <div className="flex items-center gap-4 mb-1 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="mainPictureType"
                value="url"
                checked={mainPictureType === 'url'}
                onChange={() => handleMainPictureTypeChange('url')}
              />
              Lien
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="mainPictureType"
                value="file"
                checked={mainPictureType === 'file'}
                onChange={() => handleMainPictureTypeChange('file')}
              />
              Fichier
            </label>
          </div>

          {mainPictureType === 'url' ? (
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={pokemon.mainPicture || ''}
              onChange={(e) => updateField('mainPicture', e.target.value)}
              placeholder="https://..."
            />
          ) : (
            <div className="space-y-1">
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm"
                onChange={handleMainPictureFileChange}
              />
              {pokemon.mainPictureFile && (
                <p className="text-xs text-gray-600">
                  Fichier sélectionné : {pokemon.mainPictureFile.name}
                </p>
              )}
              {pokemon.mainPicture && !pokemon.mainPictureFile && (
                <p className="text-xs text-gray-500">
                  Image actuelle : <span className="break-all">{pokemon.mainPicture}</span>
                </p>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-500 mt-1">
            Tu peux soit fournir une URL (Poképédia, etc.), soit téléverser un
            fichier. L&apos;image ne sera réellement enregistrée qu&apos;au
            moment de la validation du formulaire.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Miniature *
          </label>

          <div className="flex items-center gap-4 mb-1 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="miniPictureType"
                value="url"
                checked={miniPictureType === 'url'}
                onChange={() => handleMiniPictureTypeChange('url')}
              />
              Lien
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="miniPictureType"
                value="file"
                checked={miniPictureType === 'file'}
                onChange={() => handleMiniPictureTypeChange('file')}
              />
              Fichier
            </label>
          </div>

          {miniPictureType === 'url' ? (
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={pokemon.miniPicture || ''}
              onChange={(e) => updateField('miniPicture', e.target.value)}
              placeholder="https://..."
            />
          ) : (
            <div className="space-y-1">
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm"
                onChange={handleMiniPictureFileChange}
              />
              {pokemon.miniPictureFile && (
                <p className="text-xs text-gray-600">
                  Fichier sélectionné : {pokemon.miniPictureFile.name}
                </p>
              )}
              {pokemon.miniPicture && !pokemon.miniPictureFile && (
                <p className="text-xs text-gray-500">
                  Image actuelle :{' '}
                  <span className="break-all">{pokemon.miniPicture}</span>
                </p>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-500 mt-1">
            Même logique que pour l&apos;image principale. Si tu ne choisis pas
            de nouveau fichier ou lien, l&apos;image actuelle sera conservée.
          </p>
        </div>

                <div>
          <label className="block text-sm font-medium mb-1">
            Type principal (modèle Pokemon)
          </label>
          <select
            className="w-full border rounded px-2 py-1"
            value={pokemon.typeId ?? ''}
            onChange={(e) =>
              updateField(
                'typeId',
                e.target.value === '' ? null : Number(e.target.value),
              )
            }
          >
            <option value="">— Aucun —</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.labelFr}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
