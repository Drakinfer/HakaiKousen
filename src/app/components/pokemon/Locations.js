import * as Lucide from 'lucide-react';

function resolveLucideIcon(name) {
  const Fallback = Lucide.Sprout || Lucide.MapPin;

  if (!name || typeof name !== 'string') return Fallback;

  const pascal = name
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join('');

  return Lucide[pascal] || Fallback;
}

export default function locations({ locations = [] }) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return <p>Habitats Inconnu.</p>;
  }

  const rows = [];
  for (let i = 0; i < locations.length; i += 2) {
    rows.push(locations.slice(i, i + 2));
  }

  const renderCell = (item, key) => {
    if (!item) return <td key={key} className="p-3 align-top" />;

    const object = item.location;
    const isObj = typeof object === 'object' && object !== null;
    const title = (isObj && object.name) || String(object);
    const iconName = isObj ? object.icon : 'sprout';

    const Icon = resolveLucideIcon(iconName);

    return (
      <td key={object?.id ?? key} className="p-3 align-top">
        <p className="font-semibold flex items-center gap-2">
          <Icon aria-hidden size={18} className="shrink-0" />
          <span>{title}</span>
        </p>
      </td>
    );
  };

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Habitats</th>
              <th>Habitats</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((pair, idx) => (
              <tr key={idx} className="border-b">
                {renderCell(pair[0], `${idx}-0`)}
                {renderCell(pair[1], `${idx}-1`)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
