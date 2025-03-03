import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Evolultions({
  pokemon,
  evolutions,
  selectedGeneration,
}) {
  if (!pokemon) {
    return <p>Informations non disponible</p>;
  }

  const pokemonGeneration =
    pokemon.pokemons_generations_pokemons_generations_pokemon_idTopokemons.find(
      (gen) => gen.generations.name === selectedGeneration,
    );

  return (
    <section className="w-full bg-white mt-2">
      <div
        className={`flex ${
          pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons ||
          evolutions > 0
            ? 'justify-between'
            : 'justify-center'
        } items-center`}
      >
        {pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons && (
          <>
            <div
              className={`border-${pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons?.type.toLowerCase()} rounded-lg p-1`}
            >
              <Link
                href={`/pokemons/${pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons?.id}`}
              >
                <img
                  src={
                    pokemonGeneration
                      .pokemons_pokemons_generations_pre_evolution_idTopokemons
                      ?.main_picture
                  }
                  alt={
                    pokemonGeneration
                      .pokemons_pokemons_generations_pre_evolution_idTopokemons
                      ?.name
                  }
                  className="w-[150px] h-[150px] mx-auto"
                />
                <p className="text-center">
                  {
                    pokemonGeneration
                      .pokemons_pokemons_generations_pre_evolution_idTopokemons
                      .name
                  }
                </p>
              </Link>
            </div>
            <div className="text-center">
              <FontAwesomeIcon
                icon={faArrowRight}
                size="4x"
                className="text-center"
              />
              <p className="text-center">
                {pokemonGeneration.pre_evolution_way}
              </p>
            </div>
          </>
        )}
        <div className={`border-${pokemon.type.toLowerCase()} rounded-lg p-1`}>
          <img
            src={pokemon.main_picture}
            alt={pokemon.name}
            className="w-[150px] h-[150px] mx-auto"
          />
          <p className="text-center">{pokemon.name}</p>
        </div>
        <div className="flex flex-col">
          {evolutions.map((evo) => {
            return (
              <div className="flex justify-around">
                <div className="text-center flex flex-col justify-center items-center mr-2">
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="4x"
                    className="text-center"
                  />
                  <p className="text-center">{evo.evolution_way}</p>
                </div>
                <div
                  className={`border-${evo.pokemons.type.toLowerCase()} rounded-lg p-1`}
                >
                  <Link href={`/pokemons/${evo.pokemons.id}`}>
                    <img
                      src={evo.pokemons.main_picture}
                      alt={evo.pokemons.name}
                      className="w-[150px] h-[150px] mx-auto"
                    />
                    <p className="text-center">{evo.pokemons.name}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
