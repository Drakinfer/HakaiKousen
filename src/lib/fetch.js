export async function fetchTalents(setTalents, setLoading, nameParam = '') {
  try {
    setLoading(true);
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
  } finally {
    setLoading(false);
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

export async function fetchGenerations(setGenerations, setLoading) {
  try {
    setLoading(true);
    const res = await fetch('/api/generations');
    if (!res.ok) {
      throw new Error('Erreur lors du chargement des générations');
    }
    const data = await res.json();
    setGenerations(data.generations || data || []);
  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement des générations');
  } finally {
    setLoading(false);
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
