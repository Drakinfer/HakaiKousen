'use client';
import Link from 'next/link';

export default function TalentTable({ talents }) {
  return (
    <div className="md:ml-6 max-w-2xl overflow-y-auto h-[450px] border border-gray-300 rounded-lg bg-white">
      <table className="border-collapse text-center table-fixed w-full">
        <tbody>
          {talents.map((talent) => (
            <tr
              key={talent.id}
              className="hover:bg-gray-100 cursor-pointer text-center"
            >
              <Link href={`/talents/${talent.id}`} className="contents">
                <td className="p-2 border-b flex justify-start items-center space-x-4">
                  <span className="text-gray-800 font-semibold">
                    {talent.name}
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
