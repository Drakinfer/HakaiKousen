'use client';
import Link from 'next/link';

export default function AttacksTable({ attacks }) {
  return (
    <div className="md:ml-6 max-w-2xl overflow-y-auto h-[450px] border border-gray-300 rounded-lg bg-white">
      <table className="border-collapse text-center table-fixed w-full">
        <tbody>
          {attacks.map((attack) => (
            <tr
              key={attack.id}
              className="hover:bg-gray-100 cursor-pointer text-center"
            >
              <Link href={`/talents/${attack.id}`} className="contents">
                <td className="p-2 border-b flex justify-start items-center space-x-4">
                  <span className="text-gray-800 font-semibold">
                    {attack.name}
                  </span>
                </td>
                <td>
                  <p
                    className={`font-bold px-1 rounded-md ${attack.last_type.toLowerCase()} border-2 border-black mr-2 w-24 text-center`}
                  >
                    {attack.last_type}
                  </p>
                </td>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
