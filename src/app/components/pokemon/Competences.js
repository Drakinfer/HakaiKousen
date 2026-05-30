export default function Competences({ competences = [] }) {
  if (!Array.isArray(competences) || competences.length === 0) {
    return <p>Aucune compétence.</p>;
  }

  const rows = [];
  for (let i = 0; i < competences.length; i += 2) {
    rows.push(competences.slice(i, i + 2));
  }

  const renderCell = (item, key) => {
    if (!item) return <td key={key} className="p-3align-top" />;
    const object = item.competence;

    const isObj = typeof object === 'object' && object !== null;
    const title = (isObj && object.name) || String(object);
    const desc = isObj ? object.description : '';

    return (
      <>
        <td key={object.id ?? key} className="p-3 align-top">
          <p className="font-semibold">{title}</p>
          {desc && <p className="text-sm text-gray-600">{desc}</p>}
        </td>
        <td className="text-center">{item.points}</td>
      </>
    );
  };

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Compétences</th>
              <th>Points</th>
              <th>Compétences</th>
              <th>Points</th>
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
