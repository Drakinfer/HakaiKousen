'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { fetchDocuments } from '@/lib/fetch';
import GridTable from '../components/GridTable';
import LibraryGridItem from '../components/LibraryGridItem';

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let d = await fetchDocuments();
        setDocuments(d);
      } catch (e) {
        console.error('Erreur lors du chargement des documents', e);
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
            <h1 className="text-xl sm:text-2xl font-semibold">Bibliothèque</h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              {documents.length} document{documents.length > 1 ? 's' : ''}
            </p>
          </header>

          <GridTable
            items={documents}
            GridItemComponent={LibraryGridItem}
            emptyText="Aucun document pour le moment."
            getKey={(d) => d.id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
