'use client';
import Link from 'next/link';

export default function PokemonTable({ pokemons }) {
  return (
    <div className="md:ml-6 max-w-2xl overflow-y-auto h-[450px] border border-gray-300 rounded-lg bg-white">
      <table className="border-collapse text-center table-fixed w-full">
        <tbody>
          {pokemons.map((pokemon) => (
            <tr
              key={pokemon.id}
              className="hover:bg-gray-100 cursor-pointer text-center"
            >
              <Link href={`/pokemons/${pokemon.id}`} className="contents">
                <td className="p-2 border-b flex justify-start items-center space-x-4">
                  <img
                    src={pokemon.mini_picture || '/images/placeholder.png'}
                    alt={pokemon.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-gray-800 font-semibold">
                    #{pokemon.dex_number} {pokemon.name}
                  </span>
                </td>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
