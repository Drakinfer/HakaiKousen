import Link from 'next/link';

export default function Forms({ forms }) {
  if (forms.length < 1) {
    return <p>Informations non disponible</p>;
  }

  return (
    <section className="w-full bg-white">
      <div className="flex justify-around items-center items-strech md:flex-row flex-col">
        {forms.map((form) => {
          return (
            <div
              className={`border-${form.pokemon.type?.name.toLowerCase()} rounded-lg p-2`}
            >
              <Link href={`/pokemons/${form.pokemon.id}`}>
                <img
                  src={form.pokemon.mainPicture}
                  alt={form.pokemon.name}
                  className="w-[200px] h-[200px] mx-auto"
                />
                <p className="inline-block max-w-[200px] whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto text-center">
                  {form.pokemon.name}
                </p>
                <p className="text-center">
                  <span className="font-bold">Région</span> : {form.form}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
