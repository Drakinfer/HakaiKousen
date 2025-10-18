"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Footer from "@/app/components/Footer"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setOk("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Inscription impossible.")
        setLoading(false)
        return
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInRes?.error) {
        setOk("Compte créé. Vous pouvez vous connecter.")
        setLoading(false)
        router.push("/login")
        return
      }

      router.push("/")
    } catch (err) {
      console.error(err)
      setError("Erreur réseau.")
      setLoading(false)
    }
  }

  return (
    <>
      <section className="h-main-footer flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Créer un compte</h1>

          {error ? <p className="text-red-600 text-sm">{error}</p> : null}
          {ok ? <p className="text-green-600 text-sm">{ok}</p> : null}

          <div className="space-y-2">
            <label className="block text-sm">Pseudo</label>
            <input
              className="border rounded w-full p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Email (login)</label>
            <input
              className="border rounded w-full p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Mot de passe</label>
            <input
              className="border rounded w-full p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded p-2 border bg-red-500 text-white"
            disabled={loading}
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>

          <p className="text-sm">
            Déjà un compte ? <a className="underline" href="/login">Se connecter</a>
          </p>
        </form>
      </section>
      <Footer />
    </>
  )
}
