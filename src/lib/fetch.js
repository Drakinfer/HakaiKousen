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

export async function fetchGenerations() {
  const data = await fetchJson('/api/generations');
  return data.generations ?? [];
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

/* ---------------------------------- */
/* Types (garde ta logique Map)        */
/* ---------------------------------- */

export async function fetchTypes() {
  const data = await fetchJson('/api/types', { cache: 'no-store' });
  const types = data.types ?? [];

  const byValue = new Map();
  for (const t of types) {
    const id = Number(t?.type?.id);
    const value = String(t?.type?.name ?? '');
    if (!value) continue;

    const labelFr = t?.labelFr ?? toFr(value);
    if (!byValue.has(value)) byValue.set(value, { id, value, labelFr });
  }

  return [...byValue.values()].sort((a, b) =>
    a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
  );
}

/* ---------------------------------- */
/* Autres listes simples               */
/* ---------------------------------- */

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
