import { TYPE_FR, toFr } from '@/lib/types';
import { BREED_RATING_LABELS } from '@/lib/breedRating';

export default function Information({ pokemon, selectedGeneration }) {
  if (!pokemon) return <p>Informations non disponible</p>;

  const stats = ['dex', 'for', 'conc', 'end', 'vol', 'vita'];
  const TYPE_SLUGS = Object.keys(TYPE_FR);

  const talents = Array.isArray(pokemon.talentsLinks)
    ? pokemon.talentsLinks
    : [];

  const height = pokemon.height ?? 'Inconnue';
  const weight = pokemon.weight ?? 'Inconnu';

  const breedRatingLabel =
    BREED_RATING_LABELS?.[pokemon?.breedRating] ?? 'Inconnu';

  const type1 = pokemon.type1 || null;
  const type2 = pokemon.type2 || null;

  const type1Slug = (type1?.name || '').toLowerCase();
  const type2Slug = (type2?.name || '').toLowerCase();

  const sensitivities = TYPE_SLUGS.map((slug) => {
    const v1 = type1 ? type1[slug] : undefined;
    const v2 = type2 ? type2[slug] : undefined;

    if (v1 == null && v2 == null) return null;

    const value = v2 != null && v1 != null ? v1 * v2 : v1 ?? v2;
    return { slug, labelFr: toFr(slug), value };
  })
    .filter(Boolean)
    .sort((a, b) =>
      a.labelFr.localeCompare(b.labelFr, 'fr', {
        sensitivity: 'base',
        numeric: true,
      }),
    );

  return (
    <section className="w-full mt-1">
      {talents.length > 0 ? (
        <div>
          {talents.map((link, idx) => {
            const t = link?.talent;
            const tgList = Array.isArray(t?.talentGenerations)
              ? t.talentGenerations
              : [];
            const tg =
              tgList.find(
                (g) =>
                  g?.Generation?.name === selectedGeneration ||
                  g?.generation?.name === selectedGeneration,
              ) ||
              tgList[0] ||
              null;

            return (
              <div
                key={t?.id || idx}
                className="border border-black rounded-md overflow-hidden mb-1"
              >
                <div
                  className={`${
                    link?.hidden ? 'bg-gray-400' : 'bg-gray-200'
                  } text-center border-b border-gray-600 p-1 uppercase text-xs tracking-wider`}
                >
                  <p>NOM</p>
                  <p className="font-bold">{t?.name || 'Talent inconnu'}</p>
                </div>

                <div className="text-center border-t border-gray-600 p-1 uppercase text-xs tracking-wider">
                  <p>DESCRIPTION</p>
                  <p>{tg?.description || 'Pas de description'}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-700">Aucun talent trouvé.</p>
      )}

      <p className="mt-2">
        <span className="font-bold">Male/Femelle</span> : {breedRatingLabel}
      </p>

      <p className="mt-2">
        <span className="font-bold">Taille</span> : {height} m{' '}
        <span className="font-bold">Poids</span> : {weight} kg
      </p>

      <div className="flex mt-1">
        {type1 && (
          <p
            className={`font-bold px-1 rounded-md ${type1Slug} border-2 border-black mr-2 w-24 text-center`}
          >
            {toFr(type1Slug)}
          </p>
        )}
        {type2 && (
          <p
            className={`font-bold px-1 rounded-md ${type2Slug} border-2 border-black w-24 text-center`}
          >
            {toFr(type2Slug)}
          </p>
        )}
      </div>

      <div className="mt-1">
        <p className="font-bold">Statistiques</p>
        <div className="flex flex-wrap">
          {stats.map((stat) => (
            <div
              key={stat}
              className="inline-block text-center w-16 rounded-lg border border-black overflow-hidden mr-2 mb-2"
            >
              <div className="font-bold uppercase bg-gray-200">{stat}</div>
              <div className="bg-white text-black border-t border-black">
                {pokemon[stat]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1">
        <p className="font-bold">Sensibilités</p>
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {sensitivities.map((entry) => {
            const { slug, labelFr, value } = entry;
            return (
              <div
                key={slug}
                className="inline-block text-center w-16 rounded-lg border border-black overflow-hidden mr-2"
              >
                <div className={`font-bold uppercase ${slug}`}>
                  <span className="fa-2xs">{labelFr}</span>
                </div>
                <div className="bg-white text-black border-t border-black">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pokemon.description && <div className="mt-1">{pokemon.description}</div>}
    </section>
  );
}
