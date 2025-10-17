export { Search, User, LogIn, LogOut, BookOpen } from 'lucide-react';

import {
  Snowflake,
  TreeDeciduous,
  Droplet,
  PalmTree,
  Fish,
  PawPrint,
  Worm,
  Route,
  Rabbit,
  Waves,
  Sprout,
  Building2,
  TreePine,
  Flame,
  Mountain,
  MountainSnow,
  Sun,
  CircleHelp,
} from 'lucide-react';

// Registre: nom kebab-case -> composant Lucide
export const iconRegistry = {
  'snowflake': Snowflake,
  'tree-deciduous': TreeDeciduous,
  'droplet': Droplet,
  'tree-palm': PalmTree, // (Lucide: PalmTree)
  'fish': Fish,
  'paw-print': PawPrint,
  'worm': Worm,

  'route': Route,
  'rabbit': Rabbit,
  'waves': Waves,
  'sprout': Sprout,

  'building-2': Building2,
  'tree-pine': TreePine,
  'flame': Flame,
  'mountain': Mountain,
  'mountain-snow': MountainSnow,
  'sun': Sun,
  'circle-question-mark': CircleHelp, // (Lucide: CircleHelp)
};

// Petit helper pratique : <Icon name="tree-palm" className="w-5 h-5" />
export function Icon({ name, className, ...props }) {
  const Cmp = iconRegistry[name];
  if (!Cmp) return null;
  return <Cmp className={className} {...props} />;
}
