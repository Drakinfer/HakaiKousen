'use client';

import { useState } from 'react';
import { BREED_RATING_LABELS } from '@/lib/breedRating';
import { Icon, Trash } from '../../../../lib/lucide';

function StatInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input
        type="number"
        min="0"
        className="w-full border rounded px-2 py-1"
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value === '' ? null : Number(e.target.value))
        }
      />
    </div>
  );
}


export default function SectionGenerationsTabs({
  pokemonGenerations,
  setPokemonGenerations,
  generations,
  types,
  pokemons,
  talentsRef,
  attaquesRef,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const addGeneration = () => {
    setPokemonGenerations((prev) => [
      ...prev,
      {
        id: undefined,
        generationId: null,
        type1Id: null,
        type2Id: null,
        height: null,
        weight: null,
        breedRating: null,
        vita: null,
        dex: null,
        for: null,
        conc: null,
        end: null,
        vol: null,
        preEvolutionId: null,
        preEvolutionWay: null,
        description: '',
        talents: [],
        attaques: {
          breeding: [],
          ct: [],
          dt: [],
          lvl: [],
          tutoring: [],
        },
        evolutions: [],
        formes: [],
      },
    ]);
    setActiveIndex(pokemonGenerations.length);
  };

  const updateGeneration = (index, updater) => {
    setPokemonGenerations((prev) =>
      prev.map((pg, i) => (i === index ? updater(pg) : pg)),
    );
  };

  const removeGeneration = (index) => {
    setPokemonGenerations((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => {
      if (prev === index && prev > 0) return prev - 1;
      if (prev > index) return prev - 1;
      return 0;
    });
  };

  if (pokemonGenerations.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Données par génération</h2>
          <button
            type="button"
            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
            onClick={addGeneration}
          >
            + Ajouter une génération
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Aucun enregistrement de génération. Ajoute-en un pour commencer.
        </p>
      </div>
    );
  }

  const activeGeneration = pokemonGenerations[activeIndex];

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Données par génération</h2>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-red-500 text-white rounded"
          onClick={addGeneration}
        >
          + Ajouter une génération
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {pokemonGenerations.map((pg, index) => {
          const gen = generations.find((g) => g.id === pg.generationId);
          const label = gen?.name ?? gen?.romanNumber ?? `Gen ${pg.generationId}`;

          return (
            <button
              key={index}
              type="button"
              className={`px-2 py-1 text-sm  ${
                index === activeIndex
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {label || `Génération ${index + 1}`}
            </button>
          );
        })}
      </div>

      {activeGeneration && (
        <GenerationPanel
          generation={activeGeneration}
          onChange={(updater) => updateGeneration(activeIndex, updater)}
          onRemove={() => removeGeneration(activeIndex)}
          generations={generations}
          types={types}
          pokemons={pokemons}
          talentsRef={talentsRef}
          attaquesRef={attaquesRef}
        />
      )}
    </div>
  );
}

function GenerationPanel({
  generation,
  onChange,
  onRemove,
  generations,
  types,
  pokemons,
  talentsRef,
  attaquesRef,
}) {
  const updateField = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          <div>
            <label className="block text-sm font-medium mb-1">
              Génération *
            </label>
            <select
              className="w-full border rounded px-2 py-1"
              value={generation.generationId ?? ''}
              onChange={(e) =>
                updateField(
                  'generationId',
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
              required
            >
              <option value="">— Choisir une génération —</option>
              {generations.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name ?? g.romanNumber ?? `Gen ${g.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Répartition mâle/femelle *
            </label>
            <select
              className="w-full border rounded px-2 py-1"
              value={generation.breedRating ?? 'MALE'}
              onChange={(e) => updateField('breedRating', e.target.value)}
            >
              {Object.entries(BREED_RATING_LABELS).map(([k,v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Type 1 *
            </label>
            <select
              className="w-full border rounded px-2 py-1"
              value={generation.type1Id ?? ''}
              onChange={(e) =>
                updateField(
                  'type1Id',
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
              required
            >
              <option value="">— Choisir un type —</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.labelFr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type 2</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={generation.type2Id ?? ''}
              onChange={(e) =>
                updateField(
                  'type2Id',
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

          <div>
            <label className="block text-sm font-medium mb-1">Taille (m) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full border rounded px-2 py-1"
              value={generation.height ?? ''}
              onChange={(e) =>
                updateField(
                  'height',
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full border rounded px-2 py-1"
              value={generation.weight ?? ''}
              onChange={(e) =>
                updateField(
                  'weight',
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
            />
          </div>
        </div>

        <Trash onClick={onRemove} color="red" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatInput
            label="VITA *"
            value={generation.vita}
            onChange={(v) => updateField('vita', v)}
          />
          <StatInput
            label="DEX *"
            value={generation.dex}
            onChange={(v) => updateField('dex', v)}
          />
          <StatInput
            label="FOR *"
            value={generation.for}
            onChange={(v) => updateField('for', v)}
          />
          <StatInput
            label="CONC *"
            value={generation.conc}
            onChange={(v) => updateField('conc', v)}
          />
          <StatInput
            label="END *"
            value={generation.end}
            onChange={(v) => updateField('end', v)}
          />
          <StatInput
            label="VOL *"
            value={generation.vol}
            onChange={(v) => updateField('vol', v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Pré-évolution
          </label>
          <select
              className="w-full border rounded px-2 py-1"
              value={generation.preEvolutionId ?? ''}
              onChange={(e) =>
                updateField(
                  'preEvolutionId',
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
            >
              <option value="">— Aucun —</option>
              {pokemons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Moyen d&apos;évolution
          </label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={generation.preEvolutionWay ?? ''}
            onChange={(e) =>
              updateField('preEvolutionWay', e.target.value || null)
            }
            placeholder="Niveau 16, Pierre Feu, Bonheur..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded px-2 py-1 min-h-[80px]"
          value={generation.description ?? ''}
          onChange={(e) =>
            updateField('description', e.target.value || null)
          }
        />
      </div>

      <TalentsSection
        talents={generation.talents}
        onChange={(talents) =>
          onChange((prev) => ({ ...prev, talents }))
        }
        talentsRef={talentsRef}
      />

      <AttacksSection
        attaques={generation.attaques}
        onChange={(attaques) =>
          onChange((prev) => ({ ...prev, attaques }))
        }
        attaquesRef={attaquesRef}
      />

      <EvolutionsSection
        evolutions={generation.evolutions}
        onChange={(evolutions) =>
          onChange((prev) => ({ ...prev, evolutions }))
        }
        pokemons={pokemons}
      />

      <FormesSection
        formes={generation.formes}
        onChange={(formes) =>
          onChange((prev) => ({ ...prev, formes }))
        }
        pokemons={pokemons}
      />
    </div>
  );
}

function TalentsSection({ talents, onChange, talentsRef }) {
  const addTalent = () => {
    onChange([
      ...talents,
      {
        id: undefined,
        talentId: talentsRef[0]?.id ?? null,
        hidden: false,
      },
    ]);
  };

  const updateTalent = (index, newTalent) => {
    onChange(talents.map((t, i) => (i === index ? newTalent : t)));
  };

  const removeTalent = (index) => {
    onChange(talents.filter((_, i) => i !== index));
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Talents</h3>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-red-500 text-white"
          onClick={addTalent}
        >
          + Ajouter un talent
        </button>
      </div>

      {talents.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucun talent défini pour cette génération.
        </p>
      )}

      {talents.map((t, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_auto_auto] gap-2 items-center"
        >
          <select
            className="border rounded px-2 py-1 text-sm"
            value={t.talentId ?? ''}
            onChange={(e) =>
              updateTalent(index, {
                ...t,
                talentId:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          >
            <option value="">— Choisir un talent —</option>
            {talentsRef.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={t.hidden}
              onChange={(e) =>
                updateTalent(index, {
                  ...t,
                  hidden: e.target.checked,
                })
              }
            />
            Talent caché
          </label>
          <Trash onClick={() => removeTalent(index)} color="red" />
        </div>
      ))}
    </div>
  );
}

function AttacksSection({ attaques, onChange, attaquesRef }) {
  const updateCategory = (cat, value) => {
    onChange({
      ...attaques,
      [cat]: value,
    });
  };

  return (
    <div className="border rounded p-3 space-y-3">
      <h3 className="text-sm font-semibold mb-1">Attaques</h3>
      <AttackListSimple
        title="Niveau (Lvl)"
        attacks={attaques.lvl}
        onChange={(list) => updateCategory('lvl', list)}
        attaquesRef={attaquesRef}
        extraFields={[
          {
            key: 'learningWay',
            label: 'Condition (niveau, etc.)',
            type: 'text',
          },
        ]}
      />

      

      <AttackListSimple
        title="CT"
        attacks={attaques.ct}
        onChange={(list) => updateCategory('ct', list)}
        attaquesRef={attaquesRef}
        extraFields={[
          {
            key: 'number',
            label: 'Numéro CT',
            type: 'number',
          },
        ]}
      />

      <AttackListSimple
        title="DT"
        attacks={attaques.dt}
        onChange={(list) => updateCategory('dt', list)}
        attaquesRef={attaquesRef}
        extraFields={[
          {
            key: 'number',
            label: 'Numéro DT',
            type: 'number',
          },
        ]}
      />

      <AttackListSimple
        title="Reproduction (Breeding)"
        attacks={attaques.breeding}
        onChange={(list) => updateCategory('breeding', list)}
        attaquesRef={attaquesRef}
        extraFields={[]}
      />

      <AttackListSimple
        title="Tutorat (Tutoring)"
        attacks={attaques.tutoring}
        onChange={(list) => updateCategory('tutoring', list)}
        attaquesRef={attaquesRef}
        extraFields={[]}
      />
    </div>
  );
}

function AttackListSimple({
  title,
  attacks,
  onChange,
  attaquesRef,
  extraFields,
}) {
  const addAttack = () => {
    const base = {
      id: undefined,
      attaqueId: attaquesRef[0]?.id ?? null,
    };
    extraFields.forEach((field) => {
      base[field.key] = field.type === 'number' ? null : '';
    });

    onChange([...attacks, base]);
  };

  const updateAttack = (index, newAttack) => {
    onChange(attacks.map((a, i) => (i === index ? newAttack : a)));
  };

  const removeAttack = (index) => {
    onChange(attacks.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded p-2 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-semibold">{title}</h4>
        <button
          type="button"
          className="text-xs px-2 py-1 rounded bg-red-500 text-white"
          onClick={addAttack}
        >
          + Ajouter
        </button>
      </div>

      {attacks.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucune attaque dans cette catégorie.
        </p>
      )}

      {attacks.map((a, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center"
        >
          <div>
<label className="block text-xs mb-1">
                    Attaque
                  </label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={a.attaqueId ?? ''}
            onChange={(e) =>
              updateAttack(index, {
                ...a,
                attaqueId:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          >
            <option value="">— Attaque —</option>
            {attaquesRef.map((att) => (
              <option key={att.id} value={att.id}>
                {att.name}
              </option>
            ))}
          </select>
          </div>
          

          {extraFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {extraFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={a[field.key] ?? ''}
                    onChange={(e) =>
                      updateAttack(index, {
                        ...a,
                        [field.key]:
                          field.type === 'number'
                            ? e.target.value === ''
                              ? null
                              : Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <Trash onClick={() => removeAttack(index)} color='red'/>
        </div>
      ))}
    </div>
  );
}

function EvolutionsSection({ evolutions, onChange, pokemons }) {
  const addEvolution = () => {
    onChange([
      ...evolutions,
      { id: undefined, pokemonId: null, evolutionWay: '' },
    ]);
  };

  const updateEvolution = (index, newEvo) => {
    onChange(evolutions.map((e, i) => (i === index ? newEvo : e)));
  };

  const removeEvolution = (index) => {
    onChange(evolutions.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Évolutions</h3>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-red-500 text-white"
          onClick={addEvolution}
        >
          + Ajouter une évolution
        </button>
      </div>

      {evolutions.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucune évolution définie pour cette génération.
        </p>
      )}

      {evolutions.map((e, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-center"
        >
          <div>
            <label className="block text-xs mb-1">
              Pokémon
            </label>
            <select
              className="w-full border rounded px-2 py-1"
              value={e.pokemonId ?? ''}
              onChange={(ev) =>
                updateEvolution(index, {
                  ...e,
                  pokemonId: ev.target.value === '' ? null : Number(ev.target.value),
                })
              }
            >
              <option value="">— Aucun —</option>
              {pokemons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1">
              Moyen d&apos;évolution
            </label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              value={e.evolutionWay ?? ''}
              onChange={(ev) =>
                updateEvolution(index, {
                  ...e,
                  evolutionWay: ev.target.value,
                })
              }
            />
          </div>

        <Trash onClick={() => removeEvolution(index)} color='red'/>

        </div>
      ))}
    </div>
  );
}

function FormesSection({ formes, onChange, pokemons }) {
  const addForme = () => {
    onChange([...formes, { id: undefined, pokemonId: null, form: '' }]);
  };

  const updateForme = (index, newForme) => {
    onChange(formes.map((f, i) => (i === index ? newForme : f)));
  };

  const removeForme = (index) => {
    onChange(formes.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Formes</h3>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-red-500 text-white"
          onClick={addForme}
        >
          + Ajouter une forme
        </button>
      </div>

      {formes.length === 0 && (
        <p className="text-xs text-gray-500">
          Aucune forme alternative définie.
        </p>
      )}

      {formes.map((f, index) => {
  console.log(f); // Placé ici avant le return
  
  return (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-center"
    >
      <div>
        <label className="block text-xs mb-1">
          Pokémon
        </label>
        <select
          className="w-full border rounded px-2 py-1"
          value={f.pokemonId ?? ''}
          onChange={(e) =>
            updateForme(index, {
              ...f,
              pokemonId: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        >
          <option value="">— Aucun —</option>
          {pokemons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">
          Forme
        </label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1 text-sm"
          value={f.form ?? ''}
          onChange={(e) =>
            updateForme(index, { ...f, form: e.target.value })
          }
          placeholder="Régionale, Conditionnelle, Fakemon..."
        />
      </div>
      <Trash onClick={() => removeForme(index)} color="red" />
    </div>
  );
})}
    </div>
  );
}
