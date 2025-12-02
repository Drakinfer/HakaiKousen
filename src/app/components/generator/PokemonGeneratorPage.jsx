'use client';

import { useState, useEffect } from 'react';
import Loading from '@/app/components/Loading';
import { STATS } from '@/lib/stats';
import { NATURES } from '@/lib/natures';
import { SUB_NATURES } from '@/lib/subNatures';
import GeneratedPokemonModal from '@/app/components/modal/GeneratedPokemonModal';

// ---------------------------------
// HOOK : logique métier du générateur
// ---------------------------------
function usePokemonGenerator(initialPokemonGenerationId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomizing, setRandomizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pokemons, setPokemons] = useState([]);
  const [pokemonId, setPokemonId] = useState('');
  const [generations, setGenerations] = useState([]);
  const [generationId, setGenerationId] = useState('');
  const [pokemonGeneration, setPokemonGeneration] = useState(null);
  const [levelRange, setLevelRange] = useState('1-10');

  // Optional fields
  const [ivs, setIvs] = useState({});
  const [evs, setEvs] = useState({});
  const [evsLevel, setEvsLevel] = useState({});
  const [sex, setSex] = useState('');
  const [nature, setNature] = useState('');
  const [subNature, setSubNature] = useState('');
  const [talent, setTalent] = useState('');
  const [breedingMove, setBreedingMove] = useState('');
  const [shiny, setShiny] = useState(false);
  const [baron, setBaron] = useState(false);

  const levelRanges = [
    '1-10',
    '11-20',
    '21-30',
    '31-40',
    '41-50',
    '51-60',
    '61-70',
    '71-80',
    '81-90',
    '91-100',
  ];

  // ---------- helpers fetch ----------
  async function fetchPokemons() {
    const response = await fetch('/api/pokemons');
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.error || 'Erreur lors du chargement des Pokémon');
    }
    setPokemons(res.pokemons);
  }

  async function fetchGenerations() {
    const response = await fetch('/api/generations');
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.error || 'Erreur lors du chargement des générations');
    }
    setGenerations(res.generations);
  }

  async function fetchPokemonGenerationById(id) {
    const res = await fetch(`/api/pokemon-generation/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.error || 'Erreur lors du chargement du Pokémon génération',
      );
    }
    setPokemonGeneration(data.pokemonGeneration);
    setPokemonId(data.pokemonGeneration.pokemonId);
    setGenerationId(data.pokemonGeneration.generationId);
  }

  async function fetchPokemonGenerationBySelection() {
    const res = await fetch(
      `/api/pokemons/${pokemonId}/generations/${generationId}`,
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} – ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    setPokemonGeneration(data.pokemonGeneration);
    setPokemonId(data.pokemonGeneration.pokemonId);
    setGenerationId(data.pokemonGeneration.generationId);
  }

  async function randomize(payload) {
    const res = await fetch(`/api/pokemon-generator/${pokemonGeneration.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur serveur (${res.status}) : ${errorText}`);
    }

    return res.json();
  }

  function coerceNumbers(obj = {}) {
    const out = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      out[k] = v === '' || v === null || v === undefined ? null : Number(v);
    }
    return out;
  }

  function resetOptional() {
    setIvs({});
    setEvs({});
    setEvsLevel({});
    setSex('');
    setNature('');
    setSubNature('');
    setTalent('');
    setBreedingMove('');
    setShiny(false);
    setBaron(false);
  }

  // ---------- Submit ----------
  async function onSubmit(e) {
    e.preventDefault();
    if (!pokemonGeneration || !levelRange) {
      alert('Merci de remplir Pokémon, Génération et la plage de niveau.');
      return;
    }

    setRandomizing(true);
    try {
      const payload = {
        pokemonGenerationId: Number(pokemonGeneration.id),
        levelRange,
        options: {
          ivs: coerceNumbers(ivs),
          evs: coerceNumbers(evs),
          evsLevel: coerceNumbers(evsLevel),
          sex: sex || null,
          nature: nature || null,
          subNature: subNature || null,
          talent: talent || null,
          breedingMove: breedingMove || null,
          shiny,
          baron,
        },
      };

      const generated = await randomize(payload);
      setData(generated); // 🔴 IMPORTANT : on garde l'objet, pas du JSON string
    } catch (error) {
      console.error('Erreur lors de la génération du Pokémon :', error);
      alert("Erreur lors de la génération. Voir la console pour les détails.");
    } finally {
      setRandomizing(false);
    }
  }

  // ---------- boot ----------
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setLoading(true);
      try {
        const tasks = [fetchPokemons(), fetchGenerations()];
        if (initialPokemonGenerationId) {
          tasks.push(fetchPokemonGenerationById(initialPokemonGenerationId));
        }
        await Promise.all(tasks);
      } catch (err) {
        console.error('Erreur pendant le chargement initial :', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [initialPokemonGenerationId]);

  // ---------- sync génération/pokémon ----------
  useEffect(() => {
    if (
      !pokemonId ||
      !generationId ||
      (generationId == pokemonGeneration?.generationId &&
        pokemonId == pokemonGeneration?.pokemonId)
    ) {
      return;
    }

    fetchPokemonGenerationBySelection().catch((err) => {
      console.error('Erreur lors du fetch du Pokémon génération :', err);
      setGenerationId(null);
      setPokemonGeneration(null);
      alert(
        "Pas d'information pour cette génération, merci d'en choisir une autre.",
      );
    });
  }, [pokemonId, generationId]);

  return {
    // state
    data,
    loading,
    randomizing,
    isModalOpen,

    pokemons,
    pokemonId,
    generations,
    generationId,
    pokemonGeneration,
    levelRange,

    ivs,
    evs,
    evsLevel,
    sex,
    nature,
    subNature,
    talent,
    breedingMove,
    shiny,
    baron,
    levelRanges,

    // setters
    setPokemonId,
    setGenerationId,
    setLevelRange,
    setIvs,
    setEvs,
    setEvsLevel,
    setSex,
    setNature,
    setSubNature,
    setTalent,
    setBreedingMove,
    setShiny,
    setBaron,
    setIsModalOpen,

    // actions
    onSubmit,
    resetOptional,
  };
}

export default function PokemonGeneratorPage({
  initialPokemonGenerationId = null,
}) {
  const generator = usePokemonGenerator(initialPokemonGenerationId);

  if (generator.loading || generator.randomizing) {
    return <Loading />;
  }

  const {
    data,
    isModalOpen,
    setIsModalOpen,
    pokemons,
    pokemonId,
    generations,
    generationId,
    pokemonGeneration,
    levelRange,
    levelRanges,
    ivs,
    evs,
    evsLevel,
    sex,
    nature,
    subNature,
    talent,
    breedingMove,
    shiny,
    baron,
    setPokemonId,
    setGenerationId,
    setLevelRange,
    setIvs,
    setEvs,
    setEvsLevel,
    setSex,
    setNature,
    setSubNature,
    setTalent,
    setBreedingMove,
    setShiny,
    setBaron,
    onSubmit,
    resetOptional,
    randomizing,
  } = generator;

  return (
    <main className="items-center flex flex-col justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Générateur de fiche Pokémon
      </h1>

      <form onSubmit={onSubmit} className="w-full max-w-5xl space-y-4">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <div className="grid gap-2 ">
            <label className="font-medium">
              Pokémon <span className="text-red-500">*</span>
            </label>
            <select
              className="border rounded p-2 w-full"
              value={pokemonId}
              onChange={(e) => {
                setPokemonId(e.target.value);
                setSex('');
              }}
            >
              <option value="">— Sélectionner —</option>
              {pokemons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">
              Génération <span className="text-red-500">*</span>
            </label>
            <select
              className="border rounded p-2"
              value={generationId || ''}
              onChange={(e) => setGenerationId(e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {generations.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">
              Plage de niveau <span className="text-red-500">*</span>
            </label>
            <select
              className="border rounded p-2"
              value={levelRange}
              onChange={(e) => setLevelRange(e.target.value)}
            >
              {levelRanges.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="font-medium">Sexe (optionnel)</label>
            <select
              className="border rounded p-2"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">— (laisser vide) —</option>
              {pokemonGeneration?.breedRating === 'UNBREED' ? (
                <option value="genderless">Asexué</option>
              ) : (
                <>
                  <option value="male">Mâle</option>
                  <option value="female">Femelle</option>
                </>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">Nature (optionnel)</label>
            <select
              className="border rounded p-2"
              value={nature}
              onChange={(e) => setNature(e.target.value)}
            >
              <option value="">— (laisser vide) —</option>
              {Object.keys(NATURES).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">Sous-nature (optionnel)</label>
            <select
              className="border rounded p-2"
              value={subNature}
              onChange={(e) => setSubNature(e.target.value)}
            >
              <option value="">— (laisser vide) —</option>
              {SUB_NATURES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {pokemonGeneration?.talentsLinks?.length > 0 && (
            <div className="grid gap-2">
              <label className="font-medium">Talent (optionnel)</label>
              <select
                className="border rounded p-2"
                value={talent}
                onChange={(e) => setTalent(e.target.value)}
              >
                <option value="">— (laisser vide) —</option>
                {pokemonGeneration.talentsLinks.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m?.talent?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {pokemonGeneration?.attaques?.breeding?.length > 0 && (
            <div className="grid gap-2">
              <label className="font-medium">
                Attaque de naissance (optionnel)
              </label>
              <select
                className="border rounded p-2"
                value={breedingMove}
                onChange={(e) => setBreedingMove(e.target.value)}
              >
                <option value="">— (laisser vide) —</option>
                {pokemonGeneration.attaques.breeding.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.attaque.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={shiny}
                onChange={(e) => setShiny(e.target.checked)}
                className="accent-red-500"
              />
              <span>Shiny</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={baron}
                onChange={(e) => setBaron(e.target.checked)}
                className="accent-red-500"
              />
              <span>Baron</span>
            </label>
          </div>
        </div>

        <fieldset className="grid border rounded p-3 mt-1">
          <legend className="px-1 text-sm font-semibold">
            IVs (optionnel)
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {Object.keys(STATS).map((key) => (
              <div key={key} className="grid gap-1">
                <label className="text-sm">{STATS[key]}</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  className="border rounded p-2"
                  value={ivs[key] || ''}
                  onChange={(e) =>
                    setIvs({ ...ivs, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-3 border rounded p-3">
          <legend className="px-1 text-sm font-semibold">
            EVs (optionnel - max 30 points)
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {Object.keys(STATS).map((key) => (
              <div key={key} className="grid gap-1">
                <label className="text-sm">{STATS[key]}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="border rounded p-2"
                  value={evs[key] || ''}
                  onChange={(e) =>
                    setEvs({ ...evs, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-3 border rounded p-3">
          <legend className="px-1 text-sm font-semibold">
            EVs level (optionnel - max 30 points)
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {Object.keys(STATS).map((key) => (
              <div key={key} className="grid gap-1">
                <label className="text-sm">{STATS[key]}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="border rounded p-2"
                  value={evsLevel[key] || ''}
                  onChange={(e) =>
                    setEvsLevel({ ...evsLevel, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={randomizing}
            className="mt-1 bg-red-500 text-white p-2 rounded-lg"
          >
            {randomizing
              ? 'Génération...'
              : data
              ? 'Re-générer'
              : 'Générer aléatoirement'}
          </button>

          <button
            type="button"
            className="mt-1 bg-red-500 text-white p-2 rounded-lg"
            onClick={resetOptional}
          >
            Réinitialiser les options
          </button>

          {data && (
            <button
              type="button"
              className="mt-1 bg-red-500 text-white p-2 rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Afficher les données générées
            </button>
          )}
        </div>
      </form>

      <GeneratedPokemonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data} // objet complet du Pokémon généré
      />
    </main>
  );
}
