'use client';

import Modal from '@/app/components/Modal';
import PokemonForm from '../form/PokemonForm';

export default function PokemonFormModal({
  isOpen,
  onClose,
  mode = 'create',
  initialData = null,
  generations = [],
  types = [],
  pokemons = [],
  talentsRef = [],
  attaquesRef = [],
  competencesRef = [],
  locationsRef = [],
  onSubmit,
  isSubmitting = false,
}) {
  if (!isOpen) return null;

  const title =
    mode === 'edit' ? 'Modifier un Pokémon' : 'Créer un nouveau Pokémon';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <PokemonForm
        mode={mode}
        initialData={initialData}
        generations={generations}
        types={types}
        pokemons={pokemons}
        talentsRef={talentsRef}
        attaquesRef={attaquesRef}
        competencesRef={competencesRef}
        locationsRef={locationsRef}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
