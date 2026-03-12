'use client';
import Table from '@/app/components/Table';

export default function TalentTable({ talents, basePath }) {
  return (
    <div className="md:ml-6 max-w-2xl border border-gray-300 rounded-lg bg-white">
      <Table
        columns={[
          {
            key: 'name',
            header: null,
            thClassName: 'hidden',
            tdClassName: 'border-b',
            render: (t) => (
              <div className="flex justify-start items-center space-x-4">
                <span className="text-gray-800 font-semibold">{t.name}</span>
              </div>
            ),
          },
        ]}
        rows={talents}
        rowHref={(t) => `${basePath}/${t.id}`}
        containerClassName="overflow-y-auto h-[450px]"
        tableClassName="border-collapse table-fixed w-full"
        headClassName="hidden"
        rowClassName="hover:bg-gray-100"
      />
    </div>
  );
}
