'use client';

export default function GridTable({
  items = [],
  GridItemComponent,
  getKey = (item) => item.id,

  emptyText = 'Aucun élément pour le moment.',
  wrapperClassName = 'flex-1 overflow-hidden',
  scrollerClassName = 'h-full overflow-auto',
  gridClassName =
    'p-3 sm:p-4 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8',
  emptyClassName = 'col-span-full text-center py-10 text-sm text-neutral-500',
  itemProps,
}) {
  if (!GridItemComponent) {
    throw new Error('GridTable: GridItemComponent is required');
  }

  return (
    <section className={wrapperClassName}>
      <div className={scrollerClassName}>
        <div className={gridClassName}>
          {items.map((item, index) => (
            <GridItemComponent
              key={getKey(item, index)}
              item={item}
              {...(typeof itemProps === 'function'
                ? itemProps(item, index)
                : itemProps)}
            />
          ))}

          {items.length === 0 && (
            <div className={emptyClassName}>{emptyText}</div>
          )}
        </div>
      </div>
    </section>
  );
}
