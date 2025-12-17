'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Footer from '../components/Footer';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get('email');
  const token = params.get('token');

  if (!email || !token) router.push('/');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!token || !email) {
      setMsg('Lien invalide.');
      return;
    }

    if (password !== confirm) {
      setMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || 'Erreur');
      setLoading(false);
      return;
    }

    setMsg('Mot de passe mis à jour. Redirection...');
    setTimeout(() => router.push('/login'), 1000);
  }

  return (
    <>
      <main className="h-main-footer items-center justify-center flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center">
          Réinitialiser le mot de passe{' '}
        </h1>

        <form onSubmit={onSubmit}>
          <div className="w-50 items-center flex flex-col">
            <div className="flex flex-col items-center mt-4">
              <label>Nouveau mot de passe</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="border md:w-96 w-64"
              />
            </div>

            <div className="flex flex-col items-center mt-2">
              <label>Confirmation</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                required
                className="border md:w-96 w-64"
              />
            </div>

            <button
              disabled={loading}
              className="rounded p-2 border bg-red-500 text-white mt-4"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </main>
      <Footer />
    </>
  );
}
