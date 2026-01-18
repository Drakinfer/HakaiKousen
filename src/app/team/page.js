'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { fetchMembers } from '@/lib/fetch';
import GridTable from '../components/GridTable';
import MemberGridItem from '../components/MemberGridItem';

export default function LibraryPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let m = await fetchMembers();
        setMembers(m);
      } catch (e) {
        console.error('Erreur lors du chargement des membres', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <main className="items-center flex md:h-main-footer justify-center p-4 mb-50 md:mb-0">
        <div className="h-full flex flex-col gap-3">
          <header className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold">
              L'équipe Hakai Kousen
            </h1>
          </header>

          <GridTable
            items={members}
            GridItemComponent={MemberGridItem}
            emptyText="Aucun membre pour le moment."
            getKey={(m) => m.id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
