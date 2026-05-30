'use client';

import React from 'react';
import Modal from '@/app/components/Modal';

const STAT_KEYS = ['VITA', 'DEX', 'FOR', 'CONC', 'END', 'VOL'];

export default function GeneratedPokemonModal({ isOpen, onClose, data, pokemonGeneration, canSave = false }) {
  if (!data) return null;

  const { name, lvl, sex, nature, subNature, talent, breedingMove, shiny, baron, stats } =
    data;

  const base = stats?.base ?? {};
  const ivs = stats?.ivs ?? {};
  const evs = stats?.evs ?? {};
  const evsLevel = stats?.evsLevel ?? {};

const downloadPokemonSheet = async () => {
   const res = await fetch('/api/pokemon-sheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pgId: String(pokemonGeneration.id), data: data }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error('PDF error:', txt);
    alert('Erreur génération PDF');
    return;
  }

  const blob = await res.blob();
  const filename = res.headers.get('X-Filename') || 'fiche_pokemon.pdf';

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}


const handleSaveGeneratedPokemon = async () => {
  if (!data) return;

  try {
    const res = await fetch('/api/generated-pokemon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pokemon: data }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        setSaveError("Vous devez être connecté pour sauvegarder ce Pokémon.");
      } else {
        setSaveError("Erreur lors de la sauvegarde.");
      }
      return;
    }

    const json = await res.json();

    if (json.alreadyExists) {
      alert("Ce Pokémon généré est déjà sauvegardé dans votre profil.");
    }
  } catch (e) {
    console.error(e);
    setSaveError("Erreur réseau lors de la sauvegarde.");
}};


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pokémon généré : ${name ?? 'Inconnu'}`}
      size="lg"
    >
      <section className="mb-4 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
            Nv. {lvl ?? '?'}
          </span>
          {sex && (
            <span className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
              Sexe : {sex}
            </span>
          )}
          {nature && (
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Nature : {nature}
            </span>
          )}
          {subNature && (
            <span className="rounded bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
              Sous-nature : {subNature}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {talent && (
            <span className="rounded bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              Talent : {String(talent)}
            </span>
          )}
          {breedingMove && (
            <span className="rounded bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Attaque de naissance : {String(breedingMove)}
            </span>
          )}
          {shiny && (
            <span className="rounded bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-900">
              ✨ Shiny
            </span>
          )}
          {baron && (
            <span className="rounded bg-red-200 px-3 py-1 text-xs font-semibold text-red-900">
              🟥 Baron
            </span>
          )}
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 ">
          Détails des stats
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Stat</th>
                <th className="px-3 py-2 text-right">Base</th>
                <th className="px-3 py-2 text-right">IVs</th>
                <th className="px-3 py-2 text-right">EVs</th>
                <th className="px-3 py-2 text-right">EVs level</th>
              </tr>
            </thead>
            <tbody>
              {STAT_KEYS.map((key) => (
                <tr
                  key={key}
                  className="border-t border-slate-100 odd:bg-white even:bg-slate-50"
                >
                  <td className="px-3 py-2 font-medium">{key}</td>
                  <td className="px-3 py-2 text-right">
                    {base[key] ?? '-'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {ivs[key] ?? '-'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {evs[key] ?? '-'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {evsLevel[key] ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
  <button
    type="button"
    className="mt-4 mr-2 bg-red-500 text-white p-2 rounded-lg"
    onClick={downloadPokemonSheet}
  >
    Télécharger la fiche PDF
  </button>
{canSave && (
  <button
    type="button"
    className="mt-4 bg-red-500 text-white p-2 rounded-lg"
    onClick={handleSaveGeneratedPokemon}
  >
    Sauvegarder ce Pokémon
  </button>)}

      </section>
    </Modal>
  );
}
