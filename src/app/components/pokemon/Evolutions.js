import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Evolutions({
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
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        {pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons && (
          <>
            <div className="flex flex-col md:flex-row items-center">
              <div
                className={`border-${pokemonGeneration.pokemons_pokemons_generations_pre_evolution_idTopokemons?.type.toLowerCase()} rounded-lg p-1 w-[175px]`}
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
                    className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] mx-auto"
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
            </div>
          </>
        )}

        <div className="text-center mx-4">
          <FontAwesomeIcon
            icon={faArrowRight}
            size="4x"
            className="hidden md:inline-block"
          />
          <FontAwesomeIcon
            icon={faArrowDown}
            size="4x"
            className="inline-block md:hidden"
          />
          <p>{pokemonGeneration.pre_evolution_way}</p>
        </div>

        <div
          className={`border-${pokemon.type.toLowerCase()} rounded-lg p-1 w-[175px]`}
        >
          <img
            src={pokemon.main_picture}
            alt={pokemon.name}
            className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] mx-auto"
          />
          <p className="text-center">{pokemon.name}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          {evolutions.map((evo) => {
            return (
              <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 ">
                <div className="text-center mx-4">
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="4x"
                    className="hidden md:inline-block"
                  />
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    size="4x"
                    className="inline-block md:hidden"
                  />
                  <p>{evo.evolution_way}</p>
                </div>

                <div
                  className={`border-${evo.pokemons.type.toLowerCase()} rounded-lg p-1 w-[175px]`}
                >
                  <Link href={`/pokemons/${evo.pokemons.id}`}>
                    <img
                      src={evo.pokemons.main_picture}
                      alt={evo.pokemons.name}
                      className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] mx-auto"
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
