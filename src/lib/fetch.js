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
