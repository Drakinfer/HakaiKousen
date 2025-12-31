import LibraryGridItem from './LibraryGridItem';

export default function LibraryTable({ documents }) {
  return (
    <section className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <div className="p-3 sm:p-4 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">
          {documents.map((doc) => (
            <LibraryGridItem key={doc.id} doc={doc} />
          ))}

          {documents.length === 0 && (
            <div className="col-span-full text-center py-10 text-sm text-neutral-500">
              Aucun document pour le moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
