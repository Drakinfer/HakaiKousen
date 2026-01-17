import { toFr } from '@/lib/types'; // si tu l'utilises déjà

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, { cache: 'no-store', ...options });
  const text = await res.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ---------------------------------- */
/* Pokemons                           */
/* ---------------------------------- */

export async function fetchPokemons(queryString = '') {
  const data = await fetchJson(`/api/pokemons${queryString}`, {
    cache: 'default', // ou no-store si tu veux éviter tout cache
  });
  return data.pokemons ?? [];
}

export async function fetchPokemon(id) {
  const data = await fetchJson(`/api/pokemons/${id}`);
  const p = data?.pokemon;

  if (!p) {
    throw new Error("Réponse invalide: champ 'pokemon' manquant");
  }

  const pokemonGenerations = Array.isArray(p.pokemonGenerations)
    ? p.pokemonGenerations
    : [];

  const generations = [
    ...new Set(
      pokemonGenerations.map((g) => g?.generation?.name).filter(Boolean),
    ),
  ];

  const selectedGeneration = generations[0] ?? null;
  const selectedPokemonGeneration = pokemonGenerations[0] ?? null;

  const dexNum = Number.parseInt(p.dexNumber, 10);

  let previousPokemon = null;
  let nextPokemon = null;

  if (!Number.isNaN(dexNum)) {
    const [prev, next] = await Promise.allSettled([
      fetchJson(`/api/pokemons/dex_number/${dexNum - 1}`),
      fetchJson(`/api/pokemons/dex_number/${dexNum + 1}`),
    ]);

    if (prev.status === 'fulfilled')
      previousPokemon = prev.value?.pokemon ?? null;
    if (next.status === 'fulfilled') nextPokemon = next.value?.pokemon ?? null;
  }

  return {
    pokemon: p,
    generations,
    selectedGeneration,
    selectedPokemonGeneration,
    previousPokemon,
    nextPokemon,
  };
}

export async function fetchPokemonGenerationById(id) {
  const data = await fetchJson(`/api/pokemon-generation/${id}`);
  return data.pokemonGeneration;
}

export async function fetchPokemonGenerationBySelection(
  pokemonId,
  generationId,
) {
  if (pokemonId == null || generationId == null) {
    throw new Error('pokemonId et generationId sont requis');
  }

  const data = await fetchJson(
    `/api/pokemons/${pokemonId}/generations/${generationId}`,
  );

  const pg = data?.pokemonGeneration;
  if (!pg) {
    throw new Error("Réponse invalide: champ 'pokemonGeneration' manquant");
  }

  return pg;
}

/* ---------------------------------- */
/* Talents / Attacks                  */
/* ---------------------------------- */

export async function fetchTalents(nameParam = '') {
  const effectiveName = typeof nameParam === 'string' ? nameParam : '';
  const params = new URLSearchParams();

  if (effectiveName.trim()) params.set('name', effectiveName.trim());

  const qs = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchJson(`/api/talents${qs}`);
  return data.talents ?? [];
}

function extractGenerationName(g) {
  return g?.Generation?.name ?? g?.generation?.name ?? null;
}

export async function fetchTalent(id) {
  const data = await fetchJson(`/api/talents/${id}`);

  const talent = data?.talent;
  if (!talent) {
    throw new Error("Réponse invalide: champ 'talent' manquant");
  }

  const list = Array.isArray(talent?.talentGenerations)
    ? talent.talentGenerations
    : [];

  const generations = [
    ...new Set(list.map(extractGenerationName).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

  return { talent, generations };
}

export async function fetchAttacks(nameParam = '', typeParam = '') {
  const effectiveName = typeof nameParam === 'string' ? nameParam : '';
  const effectiveType = typeof typeParam === 'string' ? typeParam : '';

  const params = new URLSearchParams();
  if (effectiveName.trim()) params.set('name', effectiveName.trim());
  if (effectiveType) params.set('typeName', effectiveType);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchJson(`/api/attacks${qs}`);
  return data.attacks ?? [];
}

export async function fetchAttack(id) {
  const data = await fetchJson(`/api/attacks/${id}`);

  const attack = data?.attaque;
  if (!attack) {
    throw new Error("Réponse invalide: champ 'attaque' manquant");
  }

  const list = Array.isArray(attack?.attaqueGenerations)
    ? attack.attaqueGenerations
    : [];

  const generations = [
    ...new Set(list.map(extractGenerationName).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

  const selectedGeneration = generations[0] ?? null;

  return { attack, generations, selectedGeneration };
}

/* ---------------------------------- */
/* Types (garde ta logique Map)        */
/* ---------------------------------- */

export async function fetchTypes() {
  const data = await fetchJson('/api/types', { cache: 'no-store' });
  const types = data.types ?? [];

  return types
    .map((t) => {
      const id = Number(t?.type?.id);
      const value = String(t?.type?.name ?? '');
      const labelFr = t?.labelFr ?? toFr(value);

      return {
        id,
        value,
        labelFr,
        type: t?.type,
      };
    })
    .sort((a, b) =>
      a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
    );
}

/* ---------------------------------- */
/* Autres listes simples               */
/* ---------------------------------- */

export async function fetchGenerations() {
  const data = await fetchJson('/api/generations');
  return data.generations ?? [];
}

export async function fetchCompetences() {
  const data = await fetchJson('/api/competences');
  return data.competences ?? [];
}

export async function fetchLocations() {
  const data = await fetchJson('/api/locations');
  return data.locations ?? [];
}

export async function fetchDocuments() {
  const data = await fetchJson('/api/library');
  return data.documents ?? [];
}

export async function fetchParagraphs() {
  const data = await fetchJson('/api/homepage');
  return data.items ?? [];
}

export async function fetchMembers() {
  const data = await fetchJson('/api/teams');
  return data.teams ?? [];
}

export async function fetchUsers() {
  const data = await fetchJson('/api/users');
  return data.users ?? [];
}
