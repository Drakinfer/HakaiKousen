import Link from 'next/link';

export default function Forms({ pokemon, forms }) {
  if (!pokemon) {
    return <p>Informations non disponible</p>;
  }

  return (
    <section className="w-full bg-white">
      <div className="flex justify-around items-center items-strech md:flex-row flex-col">
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
