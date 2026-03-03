"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("/api/negocios/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEnviado(true);
      } else {
        setError(data.error || "Error al procesar la solicitud");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-stone-600 mb-6">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {enviado ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <p className="text-sm text-emerald-800">
                    Si el email existe en nuestro sistema, recibirás un enlace de recuperación en tu bandeja de entrada.
                  </p>
                </div>
                <p className="text-xs text-stone-500">
                  Revisa tu carpeta de spam si no encuentras el email.
                </p>
                <Link
                  href="/negocio/login"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  Volver al login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-stone-800 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="tu@negocio.com"
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-primary text-white rounded-lg px-4 py-2.5 font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
                  </button>
                </form>

                <p className="mt-6 text-xs text-stone-500 text-center">
                  <Link href="/negocio/login" className="text-primary hover:underline">
                    Volver al login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
