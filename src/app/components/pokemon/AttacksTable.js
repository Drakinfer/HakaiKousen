export default function Information({ attacks, energySystem }) {
  if (!attacks || attacks.length < 1) {
    console.log('⚠️ Aucune Attaque reçue.');
    return <p>Informations non disponibles</p>;
  }

  return (
    <section className="w-full bg-white overflow-y-auto h-[500px]">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200"></thead>
          <tbody>
            {attacks.map((attack) => (
              <>
                <tr
                  key={attack.attaques?.id || Math.random()}
                  className="border border-gray-300 bg-gray-200"
                >
                  {attack.learning_way ? (
                    <td className="p-2 text-center">
                      <p className="font-bold">Niveau</p>
                      {attack.learning_way || ''}
                    </td>
                  ) : attack.number ? (
                    <td className="p-2 text-center">
                      <p className="font-bold">Numéro</p>
                      {attack.number || ''}
                    </td>
                  ) : null}
                  <td className="p-2 text-center">
                    <p className="font-bold">Nom</p>

                    {attack.attaques?.name || ''}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-md ${attack.attaques?.attaques_generations?.[0]?.types.name.toLowerCase()} border-2 border-black`}
                    >
                      {attack.attaques?.attaques_generations?.[0]?.types.name ||
                        ''}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <p className="font-bold">Energie</p>
                    {energySystem
                      ? attack.attaques?.attaques_generations?.[0]?.energie1
                      : attack.attaques?.attaques_generations?.[0]?.energie2}
                  </td>
                  <td className="p-2 text-center">
                    <p className="font-bold">Précision</p>
                    {attack.attaques?.attaques_generations?.[0]?.precision ||
                      '-'}
                  </td>
                  <td className="p-2 text-center">
                    <p className="font-bold">Portée</p>
                    {attack.attaques?.attaques_generations?.[0]?.range || ''}
                  </td>
                  <td className="p-2 text-center">
                    <p className="font-bold">Catégorie</p>
                    {attack.attaques?.attaques_generations?.[0]?.category || ''}
                  </td>

                  <td className="p-2 text-center">
                    <p className="font-bold">Dégâts</p>
                    {attack.attaques?.attaques_generations?.[0]?.damage_base ||
                      0}
                  </td>
                </tr>
                <tr className="">
                  <td colSpan={8} className="p-2">
                    <strong>Description :</strong>{' '}
                    {attack.attaques?.attaques_generations?.[0]?.description ||
                      ''}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
