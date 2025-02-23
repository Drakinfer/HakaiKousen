'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import PokemonTable from '../components/PokemonTable';

export default function PokemonsPage() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchMode, setSearchMode] = useState('any'); // 'any' pour un seul type, 'exact' pour exactement ces types
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

  useEffect(() => {
    fetchPokemons();

    async function fetchTypes() {
      try {
        const response = await fetch(`/api/types`);
        const data = await response.json();
        if (response.ok) {
          const uniqueTypes = Array.from(
            new Set(data.types.map((type) => type.name)),
          ).map((name) => ({ name }));
          setTypes(uniqueTypes);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des types');
      }
    }
    fetchTypes();
  }, []);

  const toggleTypeSelection = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        if (searchMode === 'exact' && prev.length >= 2) {
          return prev; // Ne pas ajouter plus de 2 types en mode "exact"
        }
        return [...prev, type];
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Liste des Pokémon
        </h1>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        <div className="flex flex-col md:flex-row w-full max-w-5xl justify-center items-center">
          <div
            className={`w-full md:w-1/3 p-4 bg-white shadow-md rounded-lg ${
              showFilters ? 'block' : 'hidden md:block'
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Filtrer par Type</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Mode de recherche :
              </label>
              <select
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="any">Un seul de ces types</option>
                <option value="exact">Seulement ces types (max 2)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {types.map((type) => (
                <div key={type.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type.name}
                    checked={selectedTypes.includes(type.name)}
                    onChange={() => toggleTypeSelection(type.name)}
                    className="mr-2"
                    disabled={
                      searchMode === 'exact' &&
                      selectedTypes.length >= 2 &&
                      !selectedTypes.includes(type.name)
                    }
                  />
                  <label htmlFor={type.name} className="text-gray-700">
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={fetchPokemons}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Rechercher
            </button>
          </div>

          <PokemonTable pokemons={pokemons} />
        </div>
      </div>
      <Footer />
    </>
  );
}
