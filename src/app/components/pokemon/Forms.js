import Link from 'next/link';

export default function Forms({ pokemon, forms }) {
  if (!pokemon) {
    return <p>Informations non disponible</p>;
  }

  return (
    <section className="w-full bg-white">
      <div className="flex justify-around items-center">
        <div className={`border-${pokemon.type.toLowerCase()} rounded-lg`}>
          <img
            src={pokemon.main_picture}
            alt={pokemon.name}
            className="w-[150px] h-[150px] mx-auto"
          />
          <p className="text-center">{pokemon.name}</p>
        </div>
        {forms.map((form) => {
          return (
            <div
              className={`border-${form.pokemons.type.toLowerCase()} rounded-lg`}
            >
              <Link href={`/pokemons/${form.pokemons.id}`}>
                <img
                  src={form.pokemons.main_picture}
                  alt={form.pokemons.name}
                  className="w-[150px] h-[150px] mx-auto"
                />
                <p className="text-center">{form.pokemons.name}</p>
                <p className="text-center">{form.form}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
