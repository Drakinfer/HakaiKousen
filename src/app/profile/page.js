'use client';

import { useEffect, useMemo, useState } from 'react';
import Loading from '@/app/components/Loading';
import GeneratedPokemonModal from '../components/modal/GeneratedPokemonModal';
import { Trash } from 'lucide-react';

const TABS = {
  INFO: 'info',
  GP: 'gp',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(TABS.INFO);

  const [user, setUser] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const [infoSuccess, setInfoSuccess] = useState(null);

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [gpError, setGpError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(generated.length / pageSize));
  }, [generated.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return generated.slice(start, start + pageSize);
  }, [generated, page]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const meRes = await fetch('/api/profile', { cache: 'no-store' });
        const meData = await meRes.json();
        if (!meRes.ok)
          throw new Error(meData?.error || 'Impossible de charger le profil');

        setUser(meData.user);
        setEmail(meData.user.email || '');
        setName(meData.user.pseudo || '');

        const gpRes = await fetch('/api/generated-pokemon', {
          cache: 'no-store',
        });
        const gpData = await gpRes.json();
        if (!gpRes.ok)
          throw new Error(
            gpData?.error || 'Impossible de charger les GeneratedPokemon',
          );

        setGenerated(gpData.generatedPokemons || []);
      } catch (e) {
        setGpError(e?.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(1, totalPages)));
  }, [totalPages]);

  const saveInfos = async (e) => {
    e.preventDefault();
    setInfoError(null);
    setInfoSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanName) {
      setInfoError('Email et pseudo sont requis.');
      return;
    }

    try {
      setInfoLoading(true);
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: cleanName }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Impossible de mettre à jour');

      setUser((u) => ({
        ...(u || {}),
        email: data.user.email,
        pseudo: data.user.pseudo,
      }));
      setInfoSuccess('Informations mises à jour.');
    } catch (e) {
      setInfoError(e?.message || 'Erreur inconnue');
    } finally {
      setInfoLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwdError('Tous les champs sont requis.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('Le nouveau mot de passe doit faire au moins 8 caractères.');
      return;
    }

    try {
      setPwdLoading(true);
      const res = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error || 'Erreur lors du changement de mot de passe',
        );

      setPwdSuccess('Mot de passe mis à jour.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      setPwdError(e?.message || 'Erreur inconnue');
    } finally {
      setPwdLoading(false);
    }
  };

  const deleteGenerated = async (id) => {
    const backup = generated;
    setGenerated((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/generated-pokemon/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Suppression impossible');
    } catch (e) {
      setGenerated(backup);
      setGpError(e?.message || 'Erreur suppression');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 h-main md:overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Profil</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <button
          onClick={() => setActiveTab(TABS.INFO)}
          className={`px-4 py-2 rounded ${
            activeTab === TABS.INFO ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          Mes informations
        </button>

        <button
          onClick={() => setActiveTab(TABS.GP)}
          className={`px-4 py-2 rounded ${
            activeTab === TABS.GP ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          Mes Pokémon générés
        </button>
      </div>

      <div className="flex-1 md:overflow-hidden">
        {activeTab === TABS.INFO ? (
          <div className="h-full md:overflow-hidden flex flex-col gap-4">
            {/* Infos + edit */}
            <section className="bg-white rounded-xl shadow p-4 flex-shrink-0">
              <h2 className="text-xl font-semibold mb-3">Mes informations</h2>

              <form
                onSubmit={saveInfos}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col">
                  <label className="font-medium">Email</label>
                  <input
                    className="border rounded p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium">Pseudo</label>
                  <input
                    className="border rounded p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    autoComplete="nickname"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={infoLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
                  >
                    {infoLoading ? 'Mise à jour...' : 'Enregistrer'}
                  </button>

                  {infoError && <p className="text-red-600">{infoError}</p>}
                  {infoSuccess && (
                    <p className="text-green-600">{infoSuccess}</p>
                  )}
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl shadow p-4 flex-1 md:overflow-hidden">
              <h2 className="text-xl font-semibold mb-3">
                Changer mon mot de passe
              </h2>

              <form
                onSubmit={changePassword}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col md:col-span-2">
                  <label className="font-medium">Mot de passe actuel</label>
                  <input
                    className="border rounded p-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium">Nouveau mot de passe</label>
                  <input
                    className="border rounded p-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium">Confirmer</label>
                  <input
                    className="border rounded p-2"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
                  >
                    {pwdLoading ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>

                  {pwdError && <p className="text-red-600">{pwdError}</p>}
                  {pwdSuccess && <p className="text-green-600">{pwdSuccess}</p>}
                </div>
              </form>
            </section>
          </div>
        ) : (
          <section className="h-full bg-white rounded-xl shadow p-4 md:overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h2 className="text-xl font-semibold">
                Mes Pokémon générés sauvegardés
              </h2>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  ◀
                </button>
                <span className="text-sm">
                  Page {page} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  ▶
                </button>
              </div>
            </div>

            {gpError && (
              <p className="text-red-600 mb-2 flex-shrink-0">{gpError}</p>
            )}

            {generated.length === 0 ? (
              <p className="flex-1">Aucun Pokemon sauvegardé.</p>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start">
                {pageItems.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded p-3 flex flex-col justify-between"
                  >
                    <div
                      onClick={() => {
                        setSelectedPokemon(p);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="font-semibold">
                        {p.name || `GeneratedPokemon #${p.id}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleString('fr-FR')
                          : ''}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Trash
                        onClick={() => deleteGenerated(p.id)}
                        color="red"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <GeneratedPokemonModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              data={selectedPokemon}
            />
          </section>
        )}
      </div>
    </div>
  );
}
