import MemberGridItem from './MemberGridItem';

export default function MemberTable({ members }) {
  return (
    <section className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <div className="p-3 sm:p-4 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">
          {members.map((member) => (
            <MemberGridItem key={member.id} member={member} />
          ))}

          {members.length === 0 && (
            <div className="col-span-full text-center py-10 text-sm text-neutral-500">
              Aucun membre pour le moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
