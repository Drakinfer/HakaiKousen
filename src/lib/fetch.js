export async function fetchPokemons(setPokemons, queryString) {
  try {
    const response = await fetch(`/api/pokemons${queryString}`);
    const data = await response.json();

    if (response.ok) {
      setPokemons(data.pokemons);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
      alert('Erreur lors du chargement');
    }
  } catch (err) {
    console.error("Erreur de connexion à l'API");
  }
}

export async function fetchPokemon(
  id,
  setPokemon,
  setGenerations,
  setSelectedGeneration,
  setSelectedPokemonGeneration,
  setPreviousPokemon,
  setNextPokemon,
) {
  try {
    const res = await fetch(`/api/pokemons/${id}`, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) {
      console.log(data?.error || 'Erreur lors du chargement du Pokémon');
      alert('Erreur lors du chargement du Pokémon');
      return;
    }

    const p = data.pokemon;

    const uniqueGenerations = [
      ...new Set(
        p.pokemonGenerations.map((g) => g?.generation?.name).filter(Boolean),
      ),
    ];

    const firstGenData = p.pokemonGenerations[0] ?? null;

    setPokemon(p);
    setGenerations(uniqueGenerations);
    setSelectedGeneration(uniqueGenerations[0] || null);
    setSelectedPokemonGeneration(firstGenData);

    const dexNum = Number.parseInt(p.dexNumber, 10);
    if (!Number.isNaN(dexNum)) {
      const [prevRes, nextRes] = await Promise.allSettled([
        fetch(`/api/pokemons/dex_number/${dexNum - 1}`, {
          cache: 'no-store',
        }),
        fetch(`/api/pokemons/dex_number/${dexNum + 1}`, {
          cache: 'no-store',
        }),
      ]);

      if (prevRes.status === 'fulfilled' && prevRes.value.ok) {
        const prevData = await prevRes.value.json();
        setPreviousPokemon(prevData.pokemon);
      } else {
        setPreviousPokemon(null);
      }

      if (nextRes.status === 'fulfilled' && nextRes.value.ok) {
        const nextData = await nextRes.value.json();
        setNextPokemon(nextData.pokemon);
      } else {
        setNextPokemon(null);
      }
    }
  } catch (err) {
    console.error(err);
    alert('Erreur dans le chargement');
  }
}

export async function fetchTalents(setTalents, nameParam = '') {
  try {
    const effectiveName =
      typeof nameParam === 'string' ? nameParam : nameFilter;
    const params = new URLSearchParams();

    if (effectiveName.trim() !== '') {
      params.set('name', effectiveName.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`/api/talents${queryString}`);
    const data = await response.json();

    if (response.ok) {
      setTalents(data.talents);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
    }
  } catch (err) {
    console.error(err || "Erreur de connexion à l'API");
  }
}

export async function fetchTalent(setTalent, setGenerations, id) {
  try {
    const res = await fetch(`/api/talents/${id}`, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) {
      console.error(data?.error || 'Erreur lors du chargement du Talent');
      return null;
    }

    const t = data.talent;
    const list = Array.isArray(t?.talentGenerations) ? t.talentGenerations : [];

    const uniqueGenerations = [
      ...new Set(
        list
          .map((g) => g?.Generation?.name ?? g?.generation?.name)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

    setTalent(t);
    setGenerations(uniqueGenerations);

    return t;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

export async function fetchGenerations(setGenerations) {
  try {
    const res = await fetch('/api/generations');
    if (!res.ok) {
      throw new Error('Erreur lors du chargement des générations');
    }
    const data = await res.json();
    setGenerations(data.generations || data || []);
  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement des générations');
  }
}

export async function fetchTypes(setTypes) {
  try {
    const res = await fetch('/api/types', { cache: 'no-store' });
    if (!res.ok) throw new Error('Bad response');
    const { types = [] } = await res.json();

    const byValue = new Map();
    for (const t of types) {
      const id = Number(t.type.id);
      const value = String(t.type.name);
      const labelFr = t.labelFr ?? toFr(t.type.name);
      if (!byValue.has(value)) byValue.set(value, { id, value, labelFr });
    }

    const list = [...byValue.values()].sort((a, b) =>
      a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
    );

    setTypes(list);
  } catch (err) {
    console.error('Erreur lors de la récupération des types', err);
  }
}

export async function fetchAttacks(setAttacks, nameParam = '', typeParam = '') {
  try {
    const effectiveName =
      typeof nameParam === 'string' ? nameParam : nameFilter;
    const effectiveType =
      typeof typeParam === 'string' ? typeParam : typeFilter;

    const params = new URLSearchParams();

    if (effectiveName.trim() !== '') {
      params.set('name', effectiveName.trim());
    }

    if (effectiveType) {
      params.set('typeName', effectiveType);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`/api/attacks${queryString}`);
    const data = await response.json();

    if (response.ok) {
      setAttacks(data.attacks);
    }
  } catch (err) {
    console.log("Erreur de connexion à l'API");
  }
}

export async function fetchAttack(setAttack, setGenerations, id) {
  try {
    const res = await fetch(`/api/attacks/${id}`, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Erreur lors du chargement de l'attack");
    }

    const a = data.attaque;
    const list = Array.isArray(a?.attaqueGenerations)
      ? a.attaqueGenerations
      : [];

    const uniqueGenerations = [
      ...new Set(
        list
          .map((g) => g?.Generation?.name ?? g?.generation?.name)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

    setAttack(a);
    setGenerations(uniqueGenerations);
    if (
      typeof setSelectedGeneration === 'function' &&
      uniqueGenerations.length
    ) {
      setSelectedGeneration(uniqueGenerations[0]);
    }
  } catch (err) {
    console.error(err?.message || "Erreur de connexion à l'API");
  }
}

export async function fetchCompetences(setCompetences) {
  try {
    const response = await fetch(`/api/competences`);
    const data = await response.json();

    if (response.ok) {
      setCompetences(data.competences);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
      alert('Erreur lors du chargement');
    }
  } catch (err) {
    console.error("Erreur de connexion à l'API");
  }
}

export async function fetchLocations(setLocations) {
  try {
    const response = await fetch(`/api/locations`);
    const data = await response.json();

    if (response.ok) {
      setLocations(data.locations);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
      alert('Erreur lors du chargement');
    }
  } catch (err) {
    console.error("Erreur de connexion à l'API");
  }
}

export async function fetchDocuments(setDocuments) {
  try {
    const response = await fetch(`/api/library`);
    const data = await response.json();

    if (response.ok) {
      setDocuments(data.documents);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
      alert('Erreur lors du chargement');
    }
  } catch (err) {
    console.error("Erreur de connexion à l'API");
  }
}

export async function fetchParagraphs(setParagraphs) {
  try {
    const response = await fetch(`/api/homepage`);
    const data = await response.json();

    if (response.ok) {
      setParagraphs(data.items);
    } else {
      console.error(data.error || 'Erreur lors du chargement');
      alert('Erreur lors du chargement');
    }
  } catch (err) {
    console.error("Erreur de connexion à l'API");
  }
}
