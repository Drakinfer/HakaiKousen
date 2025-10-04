export const TYPE_FR = {
  bug: 'Insecte',
  dark: 'Ténèbres',
  dragon: 'Dragon',
  electric: 'Électrik',
  fairy: 'Fée',
  fighting: 'Combat',
  fire: 'Feu',
  flying: 'Vol',
  ghost: 'Spectre',
  grass: 'Plante',
  ground: 'Sol',
  ice: 'Glace',
  normal: 'Normal',
  poison: 'Poison',
  psychic: 'Psy',
  rock: 'Roche',
  steel: 'Acier',
  water: 'Eau',
};

export function toFr(slug) {
  if (!slug) return slug;
  return TYPE_FR[String(slug).toLowerCase()] ?? slug;
}

const FR_TO_EN = Object.fromEntries(
  Object.entries(TYPE_FR).map(([en, fr]) => [fr.toLowerCase(), en]),
);

export function frToEn(label) {
  if (!label) return null;
  return FR_TO_EN[String(label).toLowerCase()] ?? null;
}
