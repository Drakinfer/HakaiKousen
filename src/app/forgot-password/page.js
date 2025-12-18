'use client';

import { useState } from 'react';
import Footer from '../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message || 'Si cet email existe, un lien a été envoyé.');
    setLoading(false);
  }

  return (
    <>
      <main className="h-main-footer items-center justify-center flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center">
          Mot de passe oublié
        </h1>

        <form onSubmit={onSubmit}>
          <div className="w-50 items-center flex flex-col">
            <div className="flex flex-col items-center">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="border md:w-96 w-64"
              />
            </div>

            <button
              disabled={loading}
              className="rounded p-2 border bg-red-500 text-white mt-4"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </div>
        </form>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </main>
      <Footer />
    </>
  );
}
