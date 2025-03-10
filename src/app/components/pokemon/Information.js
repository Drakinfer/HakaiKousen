export default function Information({ pokemon, selectedGeneration }) {
  if (!pokemon) {
    return <p>Informations non disponible</p>;
  }

  const stats = ['dex', 'for', 'conc', 'end', 'vol', 'vita'];
  const types = [
    ['steel', 'acier'],
    ['fighting', 'combat'],
    ['dragon', 'dragon'],
    ['water', 'eau'],
    ['electric', 'electrik'],
    ['fairy', 'fée'],
    ['fire', 'feu'],
    ['ice', 'glace'],
    ['bug', 'insecte'],
    ['normal', 'normal'],
    ['grass', 'plante'],
    ['poison', 'poison'],
    ['psychic', 'psy'],
    ['rock', 'roche'],
    ['ground', 'sol'],
    ['ghost', 'spectre'],
    ['dark', 'ténèbres'],
    ['flying', 'vol'],
  ];

  console.log(pokemon);

  return (
    <section className="w-full mt-1 h-[500px]">
      {Array.isArray(pokemon.pokemon_generations_has_talents) &&
      pokemon.pokemon_generations_has_talents.length > 0 ? (
        <div>
          {pokemon.pokemon_generations_has_talents.map((talent, index) => {
            const talentGeneration = talent.talents?.talents_generations?.find(
              (gen) => gen.generations.name === selectedGeneration,
            );

            return (
              <div
                key={talent.talents?.id || index}
                className="border border-black rounded-md overflow-hidden mb-1"
              >
                <div
                  className={`${
                    talent.hidden ? 'bg-gray-400' : 'bg-gray-200'
                  } text-center border-b border-gray-600 p-1 uppercase text-xs tracking-wider`}
                >
                  <p>NOM</p>
                  <p className="font-bold">
                    {talent.talents?.name || 'Talent inconnu'}
                  </p>
                </div>

                <div className="text-center border-t border-gray-600 p-1 uppercase text-xs tracking-wider">
                  <p>DESCRIPTION</p>
                  <p>{talentGeneration?.description || 'Pas de description'}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-700">Aucun talent trouvé.</p>
      )}

      <p>
        <span className="font-bold">Taille </span>:
        {pokemon.height || 'Inconnue'}m <span className="font-bold">Poids</span>
        : {pokemon.weight || 'Inconnu'}
        kg
      </p>
      <div className="flex">
        <p
          className={`font-bold px-1 rounded-md ${pokemon.types_pokemons_generations_type1Totypes.name.toLowerCase()} border-2 border-black mr-2 w-24 text-center`}
        >
          {pokemon.types_pokemons_generations_type1Totypes.name}
        </p>
        {pokemon.types_pokemons_generations_type2Totypes && (
          <p
            className={`font-bold px-1 rounded-md ${pokemon.types_pokemons_generations_type2Totypes?.name.toLowerCase()} border-2 border-black w-24 text-center`}
          >
            {pokemon.types_pokemons_generations_type2Totypes?.name}
          </p>
        )}
      </div>
      <div className="mt-1">
        <p className="font-bold">Statistiques</p>
        <div className="flex">
          {stats.map((stat) => {
            return (
              <div class="inline-block text-center w-16 rounded-lg border border-black overflow-hidden mr-2">
                <div class="font-bold uppercase bg-gray-200">{stat}</div>
                <div class="bg-white text-black border-t border-black">
                  {pokemon[stat]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-1">
        <p className="font-bold">Sensibilités</p>
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {types.map((type) => {
            const type1 =
              pokemon.types_pokemons_generations_type1Totypes?.[type[0]];
            const type2 =
              pokemon.types_pokemons_generations_type2Totypes?.[type[0]];

            if (type1 === 999 || type2 === 999) return null;

            return (
              <div
                key={type[0]}
                className="inline-block text-center w-16 rounded-lg border border-black overflow-hidden mr-2"
              >
                <div className={`font-bold uppercase ${type[0]}`}>
                  <span className="fa-2xs">{type[1]}</span>
                </div>
                <div className="bg-white text-black border-t border-black">
                  {type2 ? type1 * type2 : type1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-1">{pokemon.description}</div>
    </section>
  );
}
