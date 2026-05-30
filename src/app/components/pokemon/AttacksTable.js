import React from 'react';
import { TYPE_FR, toFr } from '@/lib/types';
import { CATEGORY } from '@/lib/category';
import { RANGE } from '@/lib/range';

export default function Information({ attacks, energySystem }) {
  if (!attacks || attacks.length < 1) {
    return <p>Informations non disponibles</p>;
  }

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200"></thead>
          <tbody>
            {attacks.map((attack) => {
              const a = attack?.attaque;
              const ag = a?.attaqueGenerations?.[0] || null;

              const leftLabel = attack?.learningWay
                ? { title: 'Niveau', value: attack.learningWay }
                : typeof attack?.number === 'number'
                ? { title: 'Numéro', value: attack.number }
                : null;

              return (
                <React.Fragment key={attack.id ?? a?.id ?? Math.random()}>
                  <tr className="border border-gray-300 bg-gray-200">
                    {leftLabel ? (
                      <td className="p-2 text-center">
                        <p className="font-bold">{leftLabel.title}</p>
                        {leftLabel.value}
                      </td>
                    ) : (
                      <td className="p-2 text-center"></td>
                    )}

                    <td className="p-2 text-center">
                      <p className="font-bold">Nom</p>
                      {a?.name || ''}
                    </td>

                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-md ${
                          ag?.type?.name?.toLowerCase() || ''
                        } border-2 border-black`}
                      >
                        {toFr(ag?.type?.name) || ''}
                      </span>
                    </td>

                    <td className="p-2 text-center">
                      <p className="font-bold">Énergie</p>
                      {energySystem ? ag?.energie1 ?? '' : ag?.energie2 ?? ''}
                    </td>

                    <td className="p-2 text-center">
                      <p className="font-bold">Précision</p>
                      {ag?.precision ?? '-'}
                    </td>

                    <td className="p-2 text-center">
                      <p className="font-bold">Portée</p>
                      {RANGE[ag?.range] ?? ''}
                    </td>

                    <td className="p-2 text-center">
                      <p className="font-bold">Catégorie</p>
                      {CATEGORY[ag?.category] ?? ''}
                    </td>

                    <td className="p-2 text-center">
                      <p className="font-bold">Dégâts</p>
                      {ag?.damage_base ?? 0}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={8} className="p-2">
                      <strong>Description :</strong> {ag?.description || ''}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
