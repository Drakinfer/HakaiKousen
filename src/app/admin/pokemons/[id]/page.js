'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Information from '@/app/components/pokemon/Information';
import Evolutions from '@/app/components/pokemon/Evolutions';
import Forms from '@/app/components/pokemon/Forms';
import AttacksTable from '@/app/components/pokemon/AttacksTable';
import Competences from '@/app/components/pokemon/Competences';
import Locations from '@/app/components/pokemon/Locations';
import Loading from '@/app/components/Loading';
import Aside from '@/app/components/Aside';
import PokemonFormModal from '@/app/components/modal/PokemonFormModal';
import {
  faArrowLeft,
  faSquarePen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  fetchPokemon,
  fetchTypes,
  fetchTalents,
  fetchAttacks,
  fetchCompetences,
  fetchLocations,
  fetchGenerations,
} from '@/lib/fetch';
import { useSession } from 'next-auth/react';

export default function PokemonPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [previousPokemon, setPreviousPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Informations');
  const [generations, setGenerations] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedPokemonGeneration, setSelectedPokemonGeneration] =
    useState(null);
  const [energySystem, setEnergySystem] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [types, setTypes] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [generationOptions, setGenerationOptions] = useState([]);
  const [talents, setTalents] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [locations, setLocations] = useState([]);

  const isAdmin = session?.user?.role == 'ADMIN';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role === 'USER') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPokemon(id);
        if (cancelled) return;

        setPokemon(result.pokemon);
        setGenerations(result.generations);
        setSelectedGeneration(result.selectedGeneration);
        setSelectedPokemonGeneration(result.selectedPokemonGeneration);
        setPreviousPokemon(result.previousPokemon);
        setNextPokemon(result.nextPokemon);
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        setError(e.message || 'Erreur lors du chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (
      !selectedGeneration ||
      !pokemon ||
      !Array.isArray(pokemon.pokemonGenerations)
    )
      return;
    const genData =
      pokemon.pokemonGenerations.find(
        (gen) => gen?.generation?.name === selectedGeneration,
      ) || null;

    if ((genData?.id || null) !== (selectedPokemonGeneration?.id || null)) {
      setSelectedPokemonGeneration(genData);
    }
  }, [selectedGeneration, pokemon]);

  const loadOptions = async () => {
    const res = await fetch('/api/pokemons/lightAll');
    const data = await res.json();
    setPokemons(data.pokemons);
  };

  const handleEditClick = async () => {
    let ty = await fetchTypes();
    setTypes(ty);
    let g = await fetchGenerations();
    setGenerationOptions(g);
    let ta = await fetchTalents();
    setTalents(ta);
    let a = await fetchAttacks();
    setAttacks(a);
    let c = await fetchCompetences();
    setCompetences(c);
    let l = await fetchLocations();
    setLocations(l);
    loadOptions();
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

  function assertSize(file) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image trop lourde (max 4,5 Mo).');
    }
  }

  const handleSubmitEdit = async (payloadOrPokemon, pgArg, compArg, locArg) => {
    const normalized =
      payloadOrPokemon &&
      payloadOrPokemon.pokemon &&
      typeof payloadOrPokemon.pokemon === 'object'
        ? {
            pokemon: payloadOrPokemon.pokemon,
            pokemonGenerations:
              payloadOrPokemon.pokemonGenerations ?? pgArg ?? [],
            competences: payloadOrPokemon.competences ?? compArg ?? [],
            locations: payloadOrPokemon.locations ?? locArg ?? [],
          }
        : {
            pokemon: payloadOrPokemon,
            pokemonGenerations: pgArg ?? [],
            competences: compArg ?? [],
            locations: locArg ?? [],
          };

    const { pokemon, pokemonGenerations, competences, locations } = normalized;

    if (!pokemon || typeof pokemon !== 'object') {
      console.error('handleSubmitEdit: pokemon invalide', pokemon);
      alert('Erreur : données Pokémon invalides.');
      return;
    }

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

    try {
      fd.append('payload', JSON.stringify(payload));

      if (pokemon.mainPictureType === 'file' && pokemon.mainPictureFile) {
        assertSize(pokemon.mainPictureFile);
        fd.append('mainPictureFile', pokemon.mainPictureFile);
      }

      if (pokemon.miniPictureType === 'file' && pokemon.miniPictureFile) {
        assertSize(pokemon.miniPictureFile);
        fd.append('miniPictureFile', pokemon.miniPictureFile);
      }

      const res = await fetch(`/api/pokemons/${id}`, {
        method: 'PUT',
        body: fd,
      });

      const rawText = await res.text();
      console.log(res);

      if (!res.ok) {
        console.error('Erreur API PUT /api/pokemons/[id] :', rawText);
        alert('Erreur lors de la mise à jour du pokemon');
        return;
      }

      const result = await fetchPokemon(id);

      setPokemon(result.pokemon);
      setGenerations(result.generations);
      setSelectedGeneration(result.selectedGeneration);
      setSelectedPokemonGeneration(result.selectedPokemonGeneration);
      setPreviousPokemon(result.previousPokemon);
      setNextPokemon(result.nextPokemon);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pokemon', error);
      alert('Erreur lors de la mise à jour du pokemon');
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      'Es-tu sûr de vouloir supprimer ce pokémon ? Cette action est irréversible.',
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/pokemons/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API delete:', errorText);
        alert('La suppression a échoué.');
        return;
      }

      router.push('/admin/pokemons');
    } catch (error) {
      console.error('Erreur lors de la suppression du pokemon', error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  const actions = [
    { href: '/admin/pokemons', icon: faArrowLeft, title: 'Retour' },
    { onClick: handleEditClick, icon: faSquarePen, title: 'Modifier' },
    {
      onClick: handleDeleteClick,
      icon: faTrash,
      title: 'Supprimer',
      adminOnly: true,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex h-main overflow-hidden">
        <Aside actions={actions} isAdmin={isAdmin} />

        <div className="flex flex-col flex-1 p-1 w-full h-full overflow-auto">
          <div className="flex justify-between items-center mx-1">
            {previousPokemon && (
              <div
                className={`text-sm ${
                  nextPokemon ? 'w-1/6' : 'w-1/4'
                } rounded-lg border-${
                  previousPokemon
                    ? previousPokemon.type?.name.toLowerCase()
                    : 'gray-300'
                }`}
              >
                <Link
                  href={`/pokemons/${previousPokemon.id}`}
                  className="text-center block"
                >
                  <img
                    src={previousPokemon.miniPicture}
                    alt={previousPokemon.name}
                    className="w-12 h-12 mx-auto"
                  />
                  <p>
                    #{previousPokemon.dexNumber}{' '}
                    <span className="md:block hidden">
                      {previousPokemon.name}
                    </span>
                  </p>
                </Link>
              </div>
            )}

            <div
              className={`${
                nextPokemon && previousPokemon
                  ? 'w-2/3'
                  : previousPokemon || nextPokemon
                    ? 'w-3/4'
                    : 'w-full'
              } text-center rounded-lg border-${
                pokemon.type
                  ? pokemon.type?.name.toLowerCase()
                  : 'gray-500 border-2'
              } mr-1 ml-1 text-sm`}
            >
              {' '}
              <img
                src={pokemon.miniPicture}
                alt={pokemon.name}
                className="w-12 h-12 mx-auto"
              />
              <p className="font-bold">
                #{pokemon.dexNumber} {pokemon.name}
                <span className="md:block hidden">{pokemon.category}</span>
              </p>
            </div>

            {nextPokemon && (
              <div
                className={`${
                  previousPokemon ? 'w-1/6' : 'w-1/4'
                } rounded-lg border-${
                  nextPokemon.type
                    ? nextPokemon.type?.name.toLowerCase()
                    : 'gray-300'
                } mr-1 ml-1 text-sm`}
              >
                <Link
                  href={`/pokemons/${nextPokemon.id}`}
                  className="text-center block"
                >
                  <img
                    src={nextPokemon.miniPicture}
                    alt={nextPokemon.name}
                    className="w-12 h-12 mx-auto"
                  />
                  <p>
                    #{nextPokemon.dexNumber}{' '}
                    <span className="md:block hidden">{nextPokemon.name}</span>
                  </p>
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row mt-1 w-full">
            <div className="w-full md:w-1/4 p-1 bg-white rounded-lg flex flex-col items-center">
              <img
                src={pokemon.mainPicture}
                alt={pokemon.name}
                className={`border-${
                  pokemon.type ? pokemon.type?.name.toLowerCase() : 'red'
                } rounded-lg w-2/3 md:w-full max-w-xs h-1/2`}
              />
              <div className="flex justify-around items-center mt-2">
                <select
                  id="generation"
                  className={`p-2 rounded border-${
                    pokemon.type ? pokemon.type?.name.toLowerCase() : 'red'
                  } focus::ring-0 focus::border-${
                    pokemon.type ? pokemon.type?.name.toLowerCase() : 'red'
                  } focus::outline-none focus:ring-transparent mr-1`}
                  value={selectedGeneration}
                  onChange={(e) => {
                    if (selectedGeneration !== e.target.value) {
                      setSelectedGeneration(e.target.value);
                    }
                  }}
                  onBlur={(e) => e.target.blur()}
                >
                  {' '}
                  {generations.map((gen) => (
                    <option key={gen} value={gen}>
                      {gen}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setEnergySystem((prev) => !prev)}
                  className="bg-red-500 rounded-lg text-white p-1"
                >
                  {energySystem ? 'Système remanié' : 'Système de base'}
                </button>
              </div>
              {selectedPokemonGeneration && (
                <div id="tools" className="mt-2">
                  <Link
                    href={`/generators/pokemon/${selectedPokemonGeneration.id}`}
                    className="text-white mb-4 mx-auto flex flex-col items-center"
                  >
                    <button className="bg-red-500 rounded-lg text-white p-1">
                      Générateur de fiche
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex-1 p-1 bg-white rounded-lg ml-3 overflow-hidden">
              <div className="flex space-x-2 border-b pb-2 mt-3 overflow-x-auto order-1 md:order-none">
                {[
                  'Informations',
                  'Formes',
                  'Evolutions',
                  'Habitats',
                  'Compétences',
                  'Attaques par niveau',
                  'Attaques CT',
                  'Attaques DT',
                  'Attaques Reproduction',
                  'Attaques Tutorat',
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-md whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-1 overflow-y-auto h-[calc(100vh-17rem)] w-full bg-white">
                {activeTab === 'Informations' && (
                  <Information
                    pokemon={selectedPokemonGeneration}
                    selectedGeneration={selectedGeneration}
                  />
                )}
                {activeTab === 'Formes' && (
                  <Forms
                    pokemon={pokemon}
                    forms={selectedPokemonGeneration?.formes ?? []}
                  />
                )}
                {activeTab === 'Evolutions' && (
                  <Evolutions
                    pokemon={pokemon}
                    evolutions={selectedPokemonGeneration?.evolutions ?? []}
                    selectedGeneration={selectedGeneration}
                  />
                )}
                {activeTab === 'Compétences' && (
                  <Competences competences={pokemon.pokemonHasCompetences} />
                )}
                {activeTab === 'Habitats' && (
                  <Locations locations={pokemon.pokemonHasLocations} />
                )}
                {activeTab === 'Attaques par niveau' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration?.attaquesLvl ?? []}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques CT' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration?.attaquesCt ?? []}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques DT' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration?.attaquesDt ?? []}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques Reproduction' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration?.attaquesBreeding ?? []}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques Tutorat' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration?.attaquesTutoring ?? []}
                    energySystem={energySystem}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {isEditModalOpen && (
          <PokemonFormModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            mode={'edit'}
            initialData={{
              pokemon: pokemon,
              pokemonGenerations: pokemon.pokemonGenerations,
            }}
            onSubmit={handleSubmitEdit}
            generations={generationOptions}
            types={types}
            pokemons={pokemons}
            talentsRef={talents}
            attaquesRef={attacks}
            competencesRef={competences}
            locationsRef={locations}
          />
        )}
      </div>
    </>
  );
}
