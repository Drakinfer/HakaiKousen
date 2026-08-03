'use client';

import { useState, useEffect } from 'react';
import SectionGeneralPokemon from './SectionGeneralPokemon';
import SectionGenerationsTabs from './SectionGenerationTabs';
import CompetencesSection from './CompetenceSection';
import LocationsSection from './LocationsSection';

export default function PokemonForm({
  mode = 'create',
  initialData = null,
  generations,
  types,
  pokemons,
  talentsRef,     
  attaquesRef,   
  competencesRef, 
  locationsRef,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [pokemon, setPokemon] = useState({
    id: undefined,
    name: '',
    category: '',
    dexNumber: '',
    mainPicture: '',
    miniPicture: '',
    firstGenerationId: null,
    typeId: null,
  });

  const [pokemonGenerations, setPokemonGenerations] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!initialData) return;
    if (initialData.pokemon) {
      setPokemon({
        id: initialData.pokemon.id,
        name: initialData.pokemon.name ?? '',
        category: initialData.pokemon.category ?? '',
        dexNumber: initialData.pokemon.dexNumber ?? '',
        mainPicture: initialData.pokemon.mainPicture ?? '',
        miniPicture: initialData.pokemon.miniPicture ?? '',
        firstGenerationId: initialData.pokemon.firstGenerationId ?? null,
        typeId: initialData.pokemon.typeId ?? null,
      });
    }

    if (initialData.pokemonGenerations) {
      setPokemonGenerations(
        initialData.pokemonGenerations.map((pg) => ({
          id: pg.id,
          generationId: pg.generationId,
          type1Id: pg.type1Id,
          type2Id: pg.type2Id,
          height: pg.height,
          weight: pg.weight,
          breedRating: pg.breedRating,
          vita: pg.vita,
          dex: pg.dex,
          for: pg.for,
          conc: pg.conc,
          end: pg.end,
          vol: pg.vol,
          preEvolutionId: pg.preEvolutionId,
          preEvolutionWay: pg.preEvolutionWay,
          description: pg.description,
          talents: pg.talentsLinks?.map((t) => ({
            id: t.id,
            talentId: t.talentId,
            hidden: t.hidden,
          })) ?? [],
          attaques: {
            breeding: pg.attaquesBreeding?.map((a) => ({
              id: a.id,
              attaqueId: a.attaqueId,
            })) ?? [],
            ct: pg.attaquesCt?.map((a) => ({
              id: a.id,
              attaqueId: a.attaqueId,
              number: a.number,
            })) ?? [],
            dt: pg.attaquesDt?.map((a) => ({
              id: a.id,
              attaqueId: a.attaqueId,
              number: a.number,
            })) ?? [],
            lvl: pg.attaquesLvl?.map((a) => ({
              id: a.id,
              attaqueId: a.attaqueId,
              learningWay: a.learningWay,
            })) ?? [],
            tutoring: pg.attaquesTutoring?.map((a) => ({
              id: a.id,
              attaqueId: a.attaqueId,
            })) ?? [],
          },
          evolutions: pg.evolutions?.map((e) => ({
            id: e.id,
            pokemonId: e.pokemonId,
            evolutionWay: e.evolutionWay,
          })) ?? [],
          formes: pg.formes?.map((f) => ({
            id: f.id,
            pokemonId: f.pokemonId,
            form: f.form,
          })) ?? [],
        })),
      );
    }

    if (initialData.pokemon.pokemonHasCompetences) {
      setCompetences(
        initialData.pokemon.pokemonHasCompetences.map((c) => ({
          id: c.id,
          competenceId: c.competenceId,
          points: c.points,
        })),
      );
    }

    if (initialData.pokemon.pokemonHasLocations) {
      setLocations(
        initialData.pokemon.pokemonHasLocations.map((l) => ({
          id: l.id,
          locationId: l.locationId,
        })),
      );
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        pokemon,
        pokemonGenerations,
        competences,
        locations,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] pr-1"
    >
      <SectionGeneralPokemon
        pokemon={pokemon}
        setPokemon={setPokemon}
        generations={generations}
        types={types}
      />

      <SectionGenerationsTabs
        pokemonGenerations={pokemonGenerations}
        setPokemonGenerations={setPokemonGenerations}
        generations={generations}
        types={types}
        pokemons={pokemons}
        talentsRef={talentsRef}
        attaquesRef={attaquesRef}
      />

      <CompetencesSection
        competences={competences}
        setCompetences={setCompetences}
        competencesRef={competencesRef}
      />

      <LocationsSection
        locations={locations}
        setLocations={setLocations}
        locationsRef={locationsRef}
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-3 py-1 rounded border border-gray-300 text-gray-700"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-3 py-1 rounded bg-red-500 text-white disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Enregistrement...'
            : mode === 'edit'
            ? 'Mettre à jour tout'
            : 'Créer'}
        </button>
      </div>
    </form>
  );
}
