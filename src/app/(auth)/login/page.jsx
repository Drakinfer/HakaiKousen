"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Footer from "@/app/components/Footer"

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { status } = useSession()
  
    useEffect(() => {
      if (status === "authenticated") {
        router.replace("/")
      }
    }, [status, router])

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (res?.error) {
      setError("Identifiants invalides.")
      return
    }
    router.push(res?.url || callbackUrl)
  }

  return (
    <>
    <main className="h-main-footer flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Se connecter</h1>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}

        <div className="space-y-2">
          <label className="block text-sm">Email</label>
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
          />
        </div>

        <button
          type="submit"
          className="w-full rounded p-2 border"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-sm">
          Pas de compte ? <a className="underline" href="/register">Créer un compte</a>
        </p>
      </form>
    </main>
    <Footer/>
    </>
  )
}
