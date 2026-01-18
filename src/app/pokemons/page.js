'use client';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import PokemonTable from '../components/PokemonTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';
import PokemonFilters from '../components/filters/PokemonFilters';
import { fetchGenerations, fetchTypes, fetchPokemons } from '@/lib/fetch';

export default function PokemonsPage() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonsForm, setPokemonsForm] = useState([]);

  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchMode, setSearchMode] = useState('any');
  const [nameFilter, setNameFilter] = useState('');
  const [firstGen, setFirstGen] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await handleSearch();
        let t = await fetchTypes();
        const uniqueSortedTypes = [
          ...new Map(t.map((type) => [type.value, type])).values(),
        ].sort((a, b) =>
          a.labelFr.localeCompare(b.labelFr, 'fr', { numeric: true }),
        );
        setTypes(uniqueSortedTypes);
        let g = await fetchGenerations();
        setGenerations(g);
      } catch (e) {
        console.error('Erreur lors du chargement des talents', e);
      } finally {
        setLoading(false);
      }
    };

    load();
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

  const buildQueryString = () => {
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

    return params.toString() ? `?${params.toString()}` : '';
  };

  const handleSearch = async () => {
    const queryString = buildQueryString();
    const result = await fetchPokemons(queryString);
    setPokemons(result);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <main className="items-center flex md:h-main-footer justify-center p-4 mb-50 md:mb-0">
        <div className="flex items-center flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center">
            Liste des Pokémon
          </h1>

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
              onSubmit={handleSearch}
            />

            <PokemonTable pokemons={pokemons} basePath={'/pokemons'} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
