'use client';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { fetchParagraphs } from '@/lib/fetch';
import Loading from './components/Loading';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let p = await fetchParagraphs();
        setParagraphs(p);
        setAnnouncements(paragraphs.filter((p) => p.isNotification));
        setDescriptions(paragraphs.filter((p) => !p.isNotification));
      } catch (e) {
        console.error('Erreur lors du chargement des textes', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!Array.isArray(paragraphs)) {
      setAnnouncements([]);
      setDescriptions([]);
      return;
    }

    setAnnouncements(paragraphs.filter((p) => p.isNotification));
    setDescriptions(paragraphs.filter((p) => !p.isNotification));
  }, [paragraphs]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <main className="main-content">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 mb-10">
          <img src="/images/logo.png" />
          {announcements && (
            <div className="w-1/2 bg-red-500 text-white text-center p-3 shadow-md mt-3 mb-6">
              {announcements.map((announce) => (
                <>
                  {announce.title && (
                    <p className="text-lg font-semibold">{announce.title}</p>
                  )}
                  {announce.text && (
                    <p className="text-lg font-semibold">{announce.text}</p>
                  )}
                </>
              ))}
            </div>
          )}

          {descriptions && (
            <div className="w-full p-3">
              {descriptions.map((desc) => (
                <div className="mt-3">
                  {desc.title && (
                    <p className="text-m font-semibold">{desc.title}</p>
                  )}
                  {desc.text && <p className="text-m mt-2">{desc.text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
