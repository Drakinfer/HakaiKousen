'use client';
import { useEffect, useState } from 'react';
import PokemonTable from '@/app/components/PokemonTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import PokemonFilters from '@/app/components/filters/PokemonFilters';
import {
  fetchGenerations,
  fetchTypes,
  fetchPokemons,
  fetchTalents,
  fetchAttacks,
  fetchCompetences,
  fetchLocations,
} from '@/lib/fetch';
import Aside from '@/app/components/Aside';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PokemonFormModal from '@/app/components/modal/PokemonFormModal';

export default function PokemonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pokemons, setPokemons] = useState([]);
  const [pokemonOptions, setPokemonOptions] = useState([]); //complete list for form
  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [talents, setTalents] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchMode, setSearchMode] = useState('any');
  const [nameFilter, setNameFilter] = useState('');
  const [firstGen, setFirstGen] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    setLoading(true);
    fetchTypes(setTypes);
    fetchGenerations(setGenerations);
    handleSearch();
    setLoading(false);
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

  const handleSearch = () => {
    const queryString = buildQueryString();
    fetchPokemons(setPokemons, queryString);
  };

  const loadOptions = async () => {
    const res = await fetch('/api/pokemons/lightAll');
    const data = await res.json();
    setPokemonOptions(data.pokemons);
  };

  const handleAddClick = async () => {
    fetchTalents(setTalents);
    fetchAttacks(setAttacks);
    fetchCompetences(setCompetences);
    fetchLocations(setLocations);
    loadOptions();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4,5 Mo

  function assertSize(file) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image trop lourde (max 4,5 Mo).');
    }
  }

  const handleSubmitPokemon = async ({
    pokemon,
    pokemonGenerations,
    competences,
    locations,
  }) => {
    const fd = new FormData();

    const payload = {
      pokemon: {
        ...pokemon,
        mainPictureFile: undefined,
        miniPictureFile: undefined,
      },
      pokemonGenerations,
      competences,
      locations,
    };

    fd.append('payload', JSON.stringify(payload));

    if (pokemon.mainPictureType === 'file' && pokemon.mainPictureFile) {
      assertSize(pokemon.mainPictureFile);
      fd.append('mainPictureFile', pokemon.mainPictureFile);
    }

    if (pokemon.miniPictureType === 'file' && pokemon.miniPictureFile) {
      assertSize(pokemon.miniPictureFile);
      fd.append('miniPictureFile', pokemon.miniPictureFile);
    }

    const url = `/api/pokemons`;
    const method = 'POST';

    const res = await fetch(url, { method, body: fd });

    const raw = await res.text();
    if (!res.ok) throw new Error(raw || 'Erreur API');

    handleCloseModal();
    handleSearch();
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <main className="flex h-main overflow-hidden">
        <Aside
          title="Pokemons"
          actions={[
            {
              label: 'Ajouter un pokemon',
              onClick: handleAddClick,
              icon: faPlus,
            },
          ]}
        />
        <div className="flex flex-1 items-center justify-center flex-col">
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

            <PokemonTable pokemons={pokemons} basePath={'/admin/pokemons'} />
          </div>
        </div>
        {openModal && (
          <PokemonFormModal
            isOpen={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitPokemon}
            generations={generations}
            types={types}
            pokemons={pokemonOptions}
            talentsRef={talents}
            attaquesRef={attacks}
            competencesRef={competences}
            locationsRef={locations}
          />
        )}
      </main>
    </>
  );
}
