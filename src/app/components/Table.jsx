'use client';

import { useRouter } from 'next/navigation';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * columns: [
 *  { key, header, thClassName, tdClassName, render?: (row) => ReactNode }
 * ]
 *
 * rows: array d'objets
 *
 * rowHref: (row) => string | null
 * onRowClick: (row) => void
 */
export default function Table({
  columns,
  rows,
  containerClassName = 'h-full overflow-y-auto',
  tableClassName = 'min-w-full text-sm',
  headClassName = 'bg-gray-100 sticky top-0 z-10',

  rowKey = (row) => row.id,
  rowClassName = 'hover:bg-gray-50',
  rowHref,
  onRowClick,
  emptyLabel = 'Aucune donnée',
}) {
  const router = useRouter();
  const isLinkRow = typeof rowHref === 'function';
  const isClickableRow = typeof onRowClick === 'function';

  const handleRowClick = (row, href) => {
    if (href) {
      router.push(href);
    } else if (isClickableRow) {
      onRowClick(row);
    }
  };

  return (
    <div className={containerClassName}>
      <table className={tableClassName}>
        {columns?.length ? (
          <thead className={headClassName}>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cx('border px-3 py-2 text-left', c.thClassName)}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}

        <tbody>
          {!rows?.length ? (
            <tr>
              <td
                className="border px-3 py-6 text-center text-gray-500"
                colSpan={Math.max(columns?.length || 1, 1)}
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const href = isLinkRow ? rowHref(row) : null;
              const isInteractive = href || isClickableRow;

              return (
                <tr
                  key={key}
                  role={isInteractive ? 'button' : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  onClick={() => isInteractive && handleRowClick(row, href)}
                  onKeyDown={(e) => {
                    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleRowClick(row, href);
                    }
                  }}
                  className={cx(
                    isInteractive && 'cursor-pointer',
                    rowClassName
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cx('border px-3 py-2', c.tdClassName)}
                    >
                      {c.render ? c.render(row) : row?.[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}