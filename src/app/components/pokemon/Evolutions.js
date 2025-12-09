import Link from 'next/link';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const PokeCard = React.memo(function PokeCard({
  href,
  picture,
  name,
  borderSlug,
}) {
  const borderClass = borderSlug ? `border-${borderSlug}` : '';
  const Img = (
    <>
      <img
        src={picture}
        alt={name}
        className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] mx-auto"
      />
      <p className="text-center">{name}</p>
    </>
  );

  return (
    <div
      className={`rounded-lg p-1 w-[175px] border-2 border-black ${borderClass}`}
    >
      {href ? <Link href={href}>{Img}</Link> : Img}
    </div>
  );
});

function ArrowBlock({ text, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center mx-4 self-stretch ${className}`}
    >
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
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function EvoLine({ evo, fallbackTypeSlug }) {
  const slug = (evo.typeSlug || fallbackTypeSlug || '').toLowerCase();
  return (
    <div className="flex items-center justify-around md:justify-between">
      <ArrowBlock text={evo.way} />
      <PokeCard
        href={evo.href}
        picture={evo.picture}
        name={evo.name}
        borderSlug={slug}
      />
    </div>
  );
}

function EvoList({ items, fallbackTypeSlug }) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((e) => (
        <EvoLine key={e.id} evo={e} fallbackTypeSlug={fallbackTypeSlug} />
      ))}
    </div>
  );
}

function normalizeEvos(evolutions) {
  const list = Array.isArray(evolutions) ? evolutions : [];
  return list.map((e) => {
    const p = e?.pokemon;
    return {
      id: e?.id ?? p?.id ?? Math.random(),
      name: p?.name || '',
      picture: p?.mainPicture || '',
      typeSlug: (p?.type?.name || '').toLowerCase(),
      way: e?.evolutionWay || '',
      href: p?.id ? `/pokemons/${p.id}` : '#',
    };
  });
}

function computeLayout({ hasPre, evosCount }) {
  if (!hasPre && evosCount === 0) return 'none';
  if (hasPre && evosCount > 0) return 'pre+evos';
  if (hasPre && evosCount === 0) return 'pre-only';
  if (!hasPre && evosCount === 1) return 'one-evo';
  return 'many-evos';
}

export default function Evolutions({
  pokemon,
  evolutions = [],
  selectedGeneration,
}) {
  const pokemonGeneration = Array.isArray(pokemon?.pokemonGenerations)
    ? pokemon.pokemonGenerations.find(
        (g) => g?.generation?.name === selectedGeneration,
      )
    : null;

  const pre = pokemonGeneration?.preEvolution ?? null;
  const preTypeSlug = (pokemonGeneration?.type1?.name || '').toLowerCase();
  const currentTypeSlug = (
    pokemonGeneration?.type1?.name ??
    pokemon?.type?.name ??
    ''
  ).toLowerCase();

  const evos = normalizeEvos(evolutions);
  const layout = computeLayout({ hasPre: !!pre, evosCount: evos.length });

  if (evolutions.length < 1 && !pre) {
    console.log(evolutions);
    return <p>Informations non disponibles</p>;
  }

  if (layout === 'none') {
    return (
      <section className="w-full bg-white mt-2">
        <div className="flex justify-center">
          <PokeCard
            picture={pokemon.mainPicture}
            name={pokemon.name}
            borderSlug={currentTypeSlug}
          />
        </div>
      </section>
    );
  }

  if (layout === 'pre+evos') {
    return (
      <section className="w-full bg-white mt-2">
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 md:gap-10">
          <PokeCard
            href={`/pokemons/${pre.id}`}
            picture={pre.mainPicture}
            name={pre.name}
            borderSlug={preTypeSlug}
          />
          <ArrowBlock text={pokemonGeneration?.preEvolutionWay || ''} />
          <PokeCard
            picture={pokemon.mainPicture}
            name={pokemon.name}
            borderSlug={currentTypeSlug}
          />
          <div className="md:col-span-2">
            <EvoList items={evos} fallbackTypeSlug={currentTypeSlug} />
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'pre-only') {
    return (
      <section className="w-full bg-white mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 place-items-center justify-around">
          <PokeCard
            href={`/pokemons/${pre.id}`}
            picture={pre.mainPicture}
            name={pre.name}
            borderSlug={preTypeSlug}
          />
          <ArrowBlock text={pokemonGeneration?.preEvolutionWay || ''} />
          <PokeCard
            picture={pokemon.mainPicture}
            name={pokemon.name}
            borderSlug={currentTypeSlug}
          />
        </div>
      </section>
    );
  }

  if (layout === 'one-evo') {
    const e = evos[0];
    return (
      <section className="w-full bg-white mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 place-items-center justify-around">
          {' '}
          <div className="self-center">
            <PokeCard
              picture={pokemon.mainPicture}
              name={pokemon.name}
              borderSlug={currentTypeSlug}
            />
          </div>
          <ArrowBlock text={e.way} />
          <div className="self-center">
            <PokeCard
              href={e.href}
              picture={e.picture}
              name={e.name}
              borderSlug={e.typeSlug || currentTypeSlug}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6 md:gap-10">
        <PokeCard
          picture={pokemon.mainPicture}
          name={pokemon.name}
          borderSlug={currentTypeSlug}
        />
        <div className="md:col-span-2">
          <EvoList items={evos} fallbackTypeSlug={currentTypeSlug} />
        </div>
      </div>
    </section>
  );
}
