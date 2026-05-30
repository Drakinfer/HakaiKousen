import { NATURES } from '@/lib/natures';
import { SUB_NATURES } from '@/lib/subNatures';

const STAT_KEYS = ['VITA', 'DEX', 'FOR', 'CONC', 'END', 'VOL'];

function parseLevelRange(levelRange) {
  if (typeof levelRange === 'number') {
    return { min: levelRange, max: levelRange };
  }

  if (typeof levelRange === 'string') {
    const m = levelRange.match(/^(\d+)-(\d+)$/);
    if (!m) return null;
    return { min: Number(m[1]), max: Number(m[2]) };
  }

  if (levelRange && typeof levelRange === 'object') {
    const min = Number(
      levelRange.min ?? levelRange.from ?? levelRange.start ?? levelRange.level,
    );
    const max = Number(
      levelRange.max ?? levelRange.to ?? levelRange.end ?? min,
    );
    if (Number.isNaN(min) || Number.isNaN(max)) return null;
    return { min, max };
  }

  return null;
}

export function getRandomSex(breedRating) {
  switch (breedRating) {
    case 'UNBREED':
      return 'Asexué';
    case 'MALE':
      return '♂';
    case 'FEMALE':
      return '♀';
    default: {
      const match = breedRating?.match?.(/^R(\d)M(\d)F$/);
      if (!match) return 'Inconnu';

      const maleRatio = Number(match[1]);
      const femaleRatio = Number(match[2]);
      const total = maleRatio + femaleRatio;

      const random = Math.floor(Math.random() * total);
      return random < maleRatio ? '♂' : '♀';
    }
  }
}

export function getRandomNature() {
  const keys = Object.keys(NATURES);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

export function getRandomSubNature() {
  const randomIndex = Math.floor(Math.random() * SUB_NATURES.length);
  return SUB_NATURES[randomIndex];
}

export function getRandomTalent(talentsLinks = []) {
  if (!Array.isArray(talentsLinks) || talentsLinks.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * talentsLinks.length);
  const randomTalentLink = talentsLinks[randomIndex];

  return randomTalentLink.talent.name;
}

export function getRandomBreedingMove(attaquesBreeding = []) {
  if (!Array.isArray(attaquesBreeding) || attaquesBreeding.length === 0)
    return null;

  const randomIndex = Math.floor(Math.random() * attaquesBreeding.length);
  const randomBreedingMove = attaquesBreeding[randomIndex];

  return randomBreedingMove.attaque.name || null;
}

const pickOrRandom = (value, randomFn) => {
  if (value === undefined || value === null || value === '') {
    return randomFn();
  }
  return Number(value);
};

const getRandomIV = () => Math.floor(Math.random() * 4);

function generateRandomIVs(inputIVs = {}) {
  const result = {};
  STAT_KEYS.forEach((key) => {
    result[key] = pickOrRandom(inputIVs[key], getRandomIV);
  });
  return result;
}

function distributePointsOverStats(
  keys,
  maxTotal,
  maxPerStat,
  baseValues = {},
) {
  const result = {};
  let total = 0;

  keys.forEach((key) => {
    let v = Number(baseValues[key] ?? 0);
    if (Number.isNaN(v) || v < 0) v = 0;
    if (v > maxPerStat) v = maxPerStat;
    result[key] = v;
    total += v;
  });

  while (total > maxTotal) {
    const candidates = keys.filter((k) => result[k] > 0);
    if (candidates.length === 0) break;
    const randomKey = candidates[Math.floor(Math.random() * candidates.length)];
    result[randomKey] -= 1;
    total -= 1;
  }

  let remaining = maxTotal - total;
  let guard = 0;
  while (remaining > 0 && guard < 1000) {
    const candidates = keys.filter((k) => result[k] < maxPerStat);
    if (candidates.length === 0) break;

    const randomKey = candidates[Math.floor(Math.random() * candidates.length)];
    result[randomKey] += 1;
    remaining -= 1;
    guard += 1;
  }

  return result;
}

const MAX_TOTAL_EVS = 30;
const MAX_PER_STAT_EVS = 10;

function getEVRangeForLevel(level) {
  const lvl = Math.min(Math.max(Number(level) || 1, 1), 100);

  if (lvl <= 30) {
    return { min: 1, max: 10 };
  } else if (lvl <= 60) {
    return { min: 11, max: 20 };
  } else {
    return { min: 21, max: 30 };
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEVs(level, inputEVs = {}) {
  const { min, max } = getEVRangeForLevel(level);
  const targetTotal = randomInt(min, max);

  if (hasUserValues(inputEVs)) {
    return adjustUserValues(
      STAT_KEYS,
      MAX_TOTAL_EVS,
      MAX_PER_STAT_EVS,
      inputEVs,
    );
  }

  return distributePointsOverStats(STAT_KEYS, targetTotal, MAX_PER_STAT_EVS);
}

function getMaxEvsLevelTotalForLevel(level) {
  const lvl = Math.min(Math.max(Number(level) || 0, 1), 100);

  if (lvl < 13) return 0;

  const increments = Math.floor((lvl - 13) / 3) + 1;
  return Math.min(30, increments);
}

const MAX_PER_STAT_EVS_LEVEL = 10;

function generateRandomEvsLevel(level, inputEvsLevel = {}) {
  const maxTotal = getMaxEvsLevelTotalForLevel(level);

  if (hasUserValues(inputEvsLevel)) {
    return adjustUserValues(
      STAT_KEYS,
      MAX_TOTAL_EVS,
      MAX_PER_STAT_EVS_LEVEL,
      inputEvsLevel,
    );
  }

  const totalRandom = maxTotal > 0 ? randomInt(0, maxTotal) : 0;

  return distributePointsOverStats(
    STAT_KEYS,
    totalRandom,
    MAX_PER_STAT_EVS_LEVEL,
  );
}

function hasUserValues(obj = {}) {
  return Object.values(obj).some(
    (v) => v !== undefined && v !== null && v !== '',
  );
}

function adjustUserValues(keys, maxTotal, maxPerStat, baseValues = {}) {
  const result = {};
  let total = 0;

  keys.forEach((key) => {
    let v = Number(baseValues[key] ?? 0);

    if (Number.isNaN(v) || v < 0) v = 0;
    if (v > maxPerStat) v = maxPerStat;

    result[key] = v;
    total += v;
  });

  while (total > maxTotal) {
    const candidates = keys.filter((k) => result[k] > 0);
    if (candidates.length === 0) break;

    const randomKey = candidates[Math.floor(Math.random() * candidates.length)];

    result[randomKey] -= 1;
    total -= 1;
  }

  return result;
}

export function computeStats(baseStats, payload = {}) {
  const { ivs = {}, evs = {}, evsLevel = {} } = payload;

  const result = {
    base: {},
    ivs: {},
    evs: {},
    evsLevel: {},
  };

  STAT_KEYS.forEach((key) => {
    result.base[key] = Number(baseStats[key] ?? 0);
    result.ivs[key] = Number(ivs[key] ?? 0);
    result.evs[key] = Number(evs[key] ?? 0);
    result.evsLevel[key] = Number(evsLevel[key] ?? 0);
  });

  return result;
}

export function randomize(data, pokemonGeneration) {
  if (!pokemonGeneration || !data.levelRange) {
    return 'Missing informations to generate Pokemon';
  }

  const range = parseLevelRange(data.levelRange);
  if (!range) {
    return { error: 'Invalid levelRange format' };
  }

  const { min, max } = range;
  const level = Math.floor(Math.random() * (max - min + 1)) + min;
  const options = data.options || {};

  const baseStats = {
    VITA: pokemonGeneration.vita,
    DEX: pokemonGeneration.dex,
    FOR: pokemonGeneration.for,
    CONC: pokemonGeneration.conc,
    END: pokemonGeneration.end,
    VOL: pokemonGeneration.vol,
  };

  try {
    const ivs = generateRandomIVs(options.ivs ?? {});
    const evs = generateRandomEVs(level, options.evs ?? {});
    const evsLevel = generateRandomEvsLevel(level, options.evsLevel ?? {});

    let generatedPokemon = {};
    generatedPokemon.name = pokemonGeneration.pokemon.name;
    generatedPokemon.lvl = level;
    generatedPokemon.sex = options.sex
      ? options.sex == 'male'
        ? '♂'
        : '♀'
      : getRandomSex(pokemonGeneration.breedRating);
    generatedPokemon.nature = options.nature
      ? options.nature
      : getRandomNature();
    generatedPokemon.subNature = options.subNature
      ? options.subNature
      : getRandomSubNature();
    generatedPokemon.talent = data.options?.talent
      ? pokemonGeneration.talentsLinks[options.talent].talent.name
      : getRandomTalent(pokemonGeneration.talentsLinks);
    const hasBreedingMove = Math.random() == 1;
    hasBreedingMove || options.breedingMove
      ? (generatedPokemon.breedingMove = options.breedingMove
          ? pokemonGeneration.attaquesBreeding[options.breedingMove].attaque
              .name
          : getRandomBreedingMove(pokemonGeneration.attaquesBreeding))
      : null;
    generatedPokemon.shiny = options.shiny
      ? options.shiny
      : Math.random() * 100 + 1 == 100;
    generatedPokemon.baron = options.baron
      ? options.baron
      : Math.random() * 20 + 1 == 20;
    generatedPokemon.stats = computeStats(baseStats, { ivs, evs, evsLevel });

    return generatedPokemon;
  } catch (err) {
    return `Server error during generation : ${err}`;
  }
}
