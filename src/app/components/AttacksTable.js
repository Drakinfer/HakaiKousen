'use client';
import Table from '@/app/components/Table';
import { toFr } from '@/lib/types';

export default function AttacksTable({ attacks, basePath }) {
  return (
    <div className="md:ml-6 max-w-2xl border border-gray-300 rounded-lg bg-white">
      <Table
        columns={[
          {
            key: 'name',
            header: 'Nom',
            render: (a) => (
              <span className="text-gray-800 font-semibold">{a.name}</span>
            ),
          },
          {
            key: 'lastType',
            header: 'Dernier Type',
            render: (a) => (
              <span
                className={`inline-flex items-center justify-center font-bold px-1 rounded-md w-24 border-2 border-black ${a.lastType?.name?.toLowerCase()}`}
              >
                {toFr(a.lastType?.name)}
              </span>
            ),
          },
        ]}
        rows={attacks}
        rowHref={(a) => `${basePath}/${a.id}`}
        containerClassName="overflow-y-auto h-[450px]"
        tableClassName="border-collapse text-center table-fixed w-full"
        headClassName="sticky top-0 z-10 bg-white"
        rowClassName="hover:bg-gray-100"
      />
    </div>
  );
}
