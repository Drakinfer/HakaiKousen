'use client';

import Link from 'next/link';

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
  const isLinkRow = typeof rowHref === 'function';
  const isClickableRow = typeof onRowClick === 'function';

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

              if (href) {
                return (
                  <tr key={key} className={cx('cursor-pointer', rowClassName)}>
                    <Link href={href} className="contents">
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={cx('border px-3 py-2', c.tdClassName)}
                        >
                          {c.render ? c.render(row) : row?.[c.key]}
                        </td>
                      ))}
                    </Link>
                  </tr>
                );
              }

              if (isClickableRow) {
                return (
                  <tr
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => onRowClick(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onRowClick(row);
                    }}
                    className={cx('cursor-pointer', rowClassName)}
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
              }

              return (
                <tr key={key} className={rowClassName}>
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
