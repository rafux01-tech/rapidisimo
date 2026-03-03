"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);

  // Verificar token al cargar
  useEffect(() => {
    if (!token) {
      setVerificando(false);
      setTokenValido(false);
      return;
    }

    async function verificarToken() {
      try {
        const res = await fetch(`/api/negocios/auth/reset-password?token=${token}`);
        const data = await res.json();

        if (data.valid) {
          setTokenValido(true);
        } else {
          setError(
            data.reason === "expired"
              ? "Este enlace ha expirado. Solicita uno nuevo."
              : data.reason === "used"
              ? "Este enlace ya fue utilizado. Solicita uno nuevo."
              : "Enlace inválido o expirado.",
          );
        }
      } catch (err) {
        setError("Error al verificar el enlace");
      } finally {
        setVerificando(false);
      }
    }

    verificarToken();
  }, [token]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!token) {
      setError("Token no válido");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/negocios/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          nuevaPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setExito(true);
        setTimeout(() => {
          router.push("/negocio/login");
        }, 3000);
      } else {
        setError(data.error || "Error al restablecer la contraseña");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  if (verificando) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
              <p className="text-stone-600">Verificando enlace...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
                Enlace inválido
              </h1>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <p className="text-sm text-stone-600 mb-4">
                Este enlace de recuperación no es válido o ha expirado.
              </p>
              <Link
                href="/negocio/forgot-password"
                className="block text-center text-primary hover:underline text-sm font-medium"
              >
                Solicitar nuevo enlace
              </Link>
              <p className="mt-4 text-center">
                <Link href="/negocio/login" className="text-sm text-stone-500 hover:underline">
                  Volver al login
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 mb-4">
                <p className="text-sm text-emerald-800 font-medium">
                  ✓ Contraseña actualizada exitosamente
                </p>
              </div>
              <p className="text-sm text-stone-600 mb-4">
                Tu contraseña ha sido restablecida. Serás redirigido al login en unos segundos.
              </p>
              <Link
                href="/negocio/login"
                className="block text-center bg-primary text-white rounded-lg px-4 py-2.5 font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Ir al login ahora
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              Restablecer contraseña
            </h1>
            <p className="text-sm text-stone-600 mb-6">
              Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nuevaPassword"
                  className="block text-sm font-medium text-stone-800 mb-1"
                >
                  Nueva contraseña
                </label>
                <input
                  id="nuevaPassword"
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmarPassword"
                  className="block text-sm font-medium text-stone-800 mb-1"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirmarPassword"
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-primary text-white rounded-lg px-4 py-2.5 font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {cargando ? "Actualizando..." : "Restablecer contraseña"}
              </button>
            </form>

            <p className="mt-6 text-xs text-stone-500 text-center">
              <Link href="/negocio/login" className="text-primary hover:underline">
                Volver al login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-stone-50">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
                <p className="text-stone-600">Cargando...</p>
              </div>
            </div>
          </main>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
