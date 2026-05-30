'use client';
import Table from '@/app/components/Table';

export default function PokemonTable({ pokemons, basePath }) {
  return (
    <div className="md:ml-6 max-w-xl border border-gray-300 rounded-lg bg-white">
      <Table
        columns={[
          {
            key: 'pokemon',
            header: null,
            thClassName: 'hidden',
            tdClassName: 'border-b',
            render: (p) => (
              <div className="flex justify-start items-center space-x-4">
                <img
                  src={p.miniPicture}
                  alt={p.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-gray-800 font-semibold">
                  #{p.dexNumber} {p.name}
                </span>
              </div>
            ),
          },
        ]}
        rows={pokemons}
        rowHref={(p) => `${basePath}/${p.id}`}
        containerClassName="overflow-y-auto h-[450px]"
        tableClassName="border-collapse table-fixed w-full"
        headClassName="hidden"
        rowClassName="hover:bg-gray-100"
      />
    </div>
  );
}
