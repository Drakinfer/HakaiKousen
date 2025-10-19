'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import PokemonTable from '../components/PokemonTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { toFr } from '@/lib/types';
import Loading from '../components/Loading';

export default function PokemonsPage() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchMode, setSearchMode] = useState('any');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  async function fetchPokemons() {
    try {
      setLoading(true);
      let query = '';
      if (selectedTypes.length > 0) {
        query = `?types=${selectedTypes.join(',')}&mode=${searchMode}`;
      }
      const response = await fetch(`/api/pokemons${query}`);
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
        const value = t.name;
        const labelFr = t.labelFr ?? toFr(t.name);
        if (!byValue.has(value)) byValue.set(value, { value, labelFr });
      }

      const list = [...byValue.values()].sort((a, b) =>
        a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
      );

      console.log(list);

      setTypes(list);
    } catch (err) {
      console.error('Erreur lors de la récupération des types', err);
    }
  }

  useEffect(() => {
    fetchPokemons();
    fetchTypes();
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
            <div
              className={`w-full lg:w-1/3 p-4 bg-white mb-1 rounded-lg ${
                showFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">Filtrer par Type</h2>

              <div className="mb-4">
                <select
                  value={searchMode}
                  onChange={(e) => changeMode(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="any">Un seul de ces types</option>
                  <option value="exact">Seulement ces types (max 2)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {types.map((type) => (
                  <div key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={type.value}
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleTypeSelection(type.value)}
                      className="mr-2"
                      disabled={
                        searchMode === 'exact' &&
                        selectedTypes.length >= 2 &&
                        !selectedTypes.includes(type.value)
                      }
                    />
                    <label htmlFor={type.value} className="text-gray-700">
                      {type.labelFr}
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={fetchPokemons}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Rechercher
              </button>
            </div>

            <PokemonTable pokemons={pokemons} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
