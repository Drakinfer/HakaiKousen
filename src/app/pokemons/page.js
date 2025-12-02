'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import PokemonTable from '../components/PokemonTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { toFr } from '@/lib/types';
import Loading from '../components/Loading';
import PokemonFilters from '../components/filters/PokemonFilters';

export default function PokemonsPage() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchMode, setSearchMode] = useState('any');
  const [nameFilter, setNameFilter] = useState('');
  const [firstGen, setFirstGen] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  async function fetchPokemons() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (selectedTypes.length > 0) {
        params.set('types', selectedTypes.join(','));
        params.set('mode', searchMode);
      }

      if (nameFilter.trim() !== '') {
        params.set('name', nameFilter.trim());
      }

      if (firstGen !== '') {
        params.set('firstGen', firstGen);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/pokemons${queryString}`);
      const data = await response.json();

      if (response.ok) {
        setPokemons(data.pokemons);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError("Erreur de connexion à l'API");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTypes() {
    try {
      const res = await fetch('/api/types', { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad response');
      const { types = [] } = await res.json();

      const byValue = new Map();
      for (const t of types) {
        const value = t.type.name;
        const labelFr = t.labelFr ?? toFr(t.type.name);
        if (!byValue.has(value)) byValue.set(value, { value, labelFr });
      }

      const list = [...byValue.values()].sort((a, b) =>
        a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
      );

      setTypes(list);
    } catch (err) {
      console.error('Erreur lors de la récupération des types', err);
    }
  }

  async function fetchGenerations() {
    try {
      const res = await fetch('/api/generations', { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad response');
      const { generations = [] } = await res.json();
      console.log(generations);
      setGenerations(generations);
    } catch (err) {
      console.error('Erreur lors de la récupération des générations', err);
    }
  }

  useEffect(() => {
    fetchPokemons();
    fetchTypes();
    fetchGenerations();
  }, []);

  const toggleTypeSelection = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        if (searchMode === 'exact' && prev.length >= 2) {
          return prev;
        }
        return [...prev, type];
      }
    });
  };

  const changeMode = (value) => {
    if (value === 'exact') {
      if (selectedTypes.length >= 3) {
        alert(
          'Veuillez ne sélectionner que 2 types. Votre sélection a été réinitialisée.',
        );
        setSelectedTypes([]);
      }
    }
    setSearchMode(value);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <main className="items-center flex h-main-footer justify-center p-4">
        <div className="flex items-center flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center">
            Liste des Pokémon
          </h1>

          {error && <p className="text-red-500">{error}</p>}

          {/* Bouton pour afficher/masquer les filtres sur mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-red-500 text-white px-2 py-1 rounded-lg flex justify-center items-center mb-1"
          >
            <FontAwesomeIcon
              icon={showFilters ? faChevronUp : faChevronDown}
              size="lg"
            />
          </button>

          <div className="flex flex-col lg:flex-row w-full max-w-5xl justify-center items-center ">
            <PokemonFilters
              types={types}
              generations={generations}
              searchMode={searchMode}
              selectedTypes={selectedTypes}
              nameFilter={nameFilter}
              firstGen={firstGen}
              showFilters={showFilters}
              onNameChange={setNameFilter}
              onFirstGenChange={setFirstGen}
              onSearchModeChange={changeMode}
              onToggleType={toggleTypeSelection}
              onSubmit={fetchPokemons}
            />

            <PokemonTable pokemons={pokemons} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
