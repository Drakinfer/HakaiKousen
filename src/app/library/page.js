'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { fetchDocuments } from '@/lib/fetch';
import LibraryTable from '../components/LibraryTable';

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDocuments(setDocuments);
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <main className="items-center flex md:h-main-footer justify-center p-4 mb-50 md:mb-0">
        <div className="h-full flex flex-col gap-3">
          <header className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold">Library</h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              {documents.length} document{documents.length > 1 ? 's' : ''}
            </p>
          </header>

          <LibraryTable documents={documents} />
        </div>
      </main>
      <Footer />
    </>
  );
}
