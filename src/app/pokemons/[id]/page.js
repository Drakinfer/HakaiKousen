'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Information from '../../components/pokemon/Information';
import Evolutions from '../../components/pokemon/Evolutions';
import Forms from '../../components/pokemon/Forms';
import AttacksTable from '../../components/pokemon/AttacksTable';
import Loading from '@/app/components/Loading';
import Aside from '../../components/Aside';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function PokemonPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [previousPokemon, setPreviousPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Informations');
  const [generations, setGenerations] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedPokemonGeneration, setSelectedPokemonGeneration] =
    useState(null);
  const [energySystem, setEnergySystem] = useState(true);
  const actions = [{ href: '/pokemons', icon: faArrowLeft, title: 'Retour' }];

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(`/api/pokemons/${id}`);
        const data = await response.json();

        if (response.ok) {
          const pokemonData = data.pokemon;

          const uniqueGenerations = Array.from(
            new Set(
              pokemonData.pokemons_generations_pokemons_generations_pokemon_idTopokemons.map(
                (gen) => gen.generations.name,
              ),
            ),
          ).sort();

          const firstGenData =
            pokemonData.pokemons_generations_pokemons_generations_pokemon_idTopokemons.find(
              (gen) => gen.generations.name === uniqueGenerations[0],
            );

          setPokemon(pokemonData);
          setGenerations(uniqueGenerations);
          setSelectedGeneration(uniqueGenerations[0]);
          setSelectedPokemonGeneration(firstGenData);

          const prevResponse = await fetch(
            `/api/pokemons/dex_number/${parseInt(pokemonData.dex_number) - 1}`,
          );
          const nextResponse = await fetch(
            `/api/pokemons/dex_number/${parseInt(pokemonData.dex_number) + 1}`,
          );

          const prevData = await prevResponse.json();
          const nextData = await nextResponse.json();

          if (prevResponse.ok) setPreviousPokemon(prevData.pokemon);
          if (nextResponse.ok) setNextPokemon(nextData.pokemon);
        } else {
          setError(data.error || 'Erreur lors du chargement du Pokémon');
        }
      } catch (err) {
        setError("Erreur de connexion à l'API");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPokemon();
    }
  }, [id]);

  useEffect(() => {
    if (selectedGeneration && pokemon) {
      const genData =
        pokemon.pokemons_generations_pokemons_generations_pokemon_idTopokemons.find(
          (gen) => gen.generations.name === selectedGeneration,
        );
      if (genData !== selectedPokemonGeneration) {
        setSelectedPokemonGeneration(genData);
      }
    }
  }, [selectedGeneration, pokemon]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <Aside actions={actions} />

        <div className="flex flex-col flex-1 p-1 w-full h-full overflow-auto">
          <div className="flex justify-between items-center mx-1">
            {previousPokemon && (
              <div
                className={`text-sm ${
                  nextPokemon ? 'w-1/6' : 'w-1/4'
                } rounded-lg border-${
                  previousPokemon
                    ? previousPokemon.type.toLowerCase()
                    : 'gray-300'
                }`}
              >
                <Link
                  href={`/pokemons/${previousPokemon.id}`}
                  className="text-center block"
                >
                  <img
                    src={previousPokemon.mini_picture}
                    alt={previousPokemon.name}
                    className="w-12 h-12 mx-auto"
                  />
                  <p>
                    #{previousPokemon.dex_number}{' '}
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
                pokemon.type ? pokemon.type.toLowerCase() : 'gray-500 border-2'
              } mr-1 ml-1 text-sm`}
            >
              {' '}
              <img
                src={pokemon.mini_picture}
                alt={pokemon.name}
                className="w-12 h-12 mx-auto"
              />
              <p className="font-bold">
                #{pokemon.dex_number} {pokemon.name}
                <span className="md:block hidden">- {pokemon.category}</span>
              </p>
            </div>

            {nextPokemon && (
              <div
                className={`${
                  previousPokemon ? 'w-1/6' : 'w-1/4'
                } rounded-lg border-${
                  nextPokemon.type ? nextPokemon.type.toLowerCase() : 'gray-300'
                } mr-1 ml-1 text-sm`}
              >
                <Link
                  href={`/pokemons/${nextPokemon.id}`}
                  className="text-center block"
                >
                  <img
                    src={nextPokemon.mini_picture}
                    alt={nextPokemon.name}
                    className="w-12 h-12 mx-auto"
                  />
                  <p>
                    #{nextPokemon.dex_number}{' '}
                    <span className="md:block hidden">{nextPokemon.name}</span>
                  </p>
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row mt-1 w-full">
            <div className="w-full md:w-1/4 p-1 bg-white rounded-lg flex flex-col items-center">
              <img
                src={pokemon.main_picture}
                alt={pokemon.name}
                className={`border-${pokemon.type.toLowerCase()} rounded-lg w-2/3 md:w-full max-w-xs h-auto`}
              />
              <div className="flex justify-around items-center mt-2">
                <select
                  id="generation"
                  className={`p-2 rounded border-${pokemon.type.toLowerCase()} focus::ring-0 focus::border-${pokemon.type.toLowerCase()} focus::outline-none focus:ring-transparent mr-1`}
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
            </div>

            <div className="flex-1 p-1 bg-white rounded-lg ml-3 overflow-hidden">
              <div className="flex space-x-2 border-b pb-2 mt-3 overflow-x-auto order-1 md:order-none">
                {[
                  'Informations',
                  'Formes',
                  'Evolutions',
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
                    forms={selectedPokemonGeneration.formes}
                  />
                )}
                {activeTab === 'Evolutions' && (
                  <Evolutions
                    pokemon={pokemon}
                    evolutions={selectedPokemonGeneration.evolutions}
                    selectedGeneration={selectedGeneration}
                  />
                )}
                {activeTab === 'Attaques par niveau' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration.attaques_lvl}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques CT' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration.attaques_ct}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques DT' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration.attaques_dt}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques Reproduction' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration.attaques_breeding}
                    energySystem={energySystem}
                  />
                )}
                {activeTab === 'Attaques Tutorat' && (
                  <AttacksTable
                    attacks={selectedPokemonGeneration.attaques_tutoring}
                    energySystem={energySystem}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
