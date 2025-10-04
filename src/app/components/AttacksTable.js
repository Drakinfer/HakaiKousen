'use client';
import Link from 'next/link';
import { TYPE_FR, toFr } from '@/lib/types';
import { useRouter } from 'next/navigation';

function ClickableRow({ href, ariaLabel, children }) {
  const router = useRouter();
  const go = () => router.push(href);

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={go}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
      className="hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </tr>
  );
}

export default function AttacksTable({ attacks }) {
  return (
    <div className="md:ml-6 max-w-2xl overflow-y-auto h-[450px] border border-gray-300 rounded-lg bg-white">
      <table className="border-collapse text-center table-fixed w-full">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Dernier Type</th>
          </tr>
        </thead>
        <tbody className="[&>tr>td]:text-center [&>tr>td]:align-middle">
          {attacks.map((a) => (
            <ClickableRow
              key={a.id}
              href={`/attacks/${a.id}`}
              ariaLabel={`Voir ${a.name}`}
            >
              <td className="p-2 border-b">
                <span className="text-gray-800 font-semibold">{a.name}</span>
              </td>
              <td className="p-2 border-b">
                <span
                  className={`inline-flex items-center justify-center font-bold px-1 rounded-md w-24 border-2 border-black ${a.lastType?.name?.toLowerCase()}`}
                >
                  {toFr(a.lastType?.name)}
                </span>
              </td>
            </ClickableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
