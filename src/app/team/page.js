'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { fetchMembers } from '@/lib/fetch';
import MemberTable from '../components/MemberTable';

export default function LibraryPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMembers(setMembers);
    setLoading(false);
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

          <MemberTable members={members} />
        </div>
      </main>
      <Footer />
    </>
  );
}
