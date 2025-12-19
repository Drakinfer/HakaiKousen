'use client';

import PokemonGeneratorPage from '@/app/components/generator/PokemonGeneratorPage';

export default function GeneratorPage({ params }) {
  const id = params?.id?.[0] ? Number(params.id[0]) : null;

  return <PokemonGeneratorPage initialPokemonGenerationId={id} />;
}
