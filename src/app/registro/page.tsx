"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import BadgePagoSeguro from "@/components/BadgePagoSeguro";
import { useLocale } from "@/lib/locale-context";

export default function RegistroPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/menu");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          {t.registro.titulo}
        </h1>
        <p className="text-stone-600 mb-6">{t.registro.subtitulo}</p>

        {/* Mensajes de confianza */}
        <div className="space-y-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-medium text-green-900">
              🛡️ {t.datos.protegidos}
            </p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-sm font-medium text-sky-900">
              📍 {t.datos.soloDireccion}
            </p>
          </div>
        </div>

        <form onSubmit={handleContinuar} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-stone-700 mb-1">
              {t.registro.nombre}
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Ej. María López"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-stone-700 mb-1">
              {t.registro.telefono}
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="809 555 1234"
            />
          </div>
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-stone-700 mb-1">
              {t.registro.direccion}
            </label>
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder={t.registro.direccionPlaceholder}
            />
          </div>

          <p className="text-sm text-stone-500 flex items-center gap-2">
            <BadgePagoSeguro /> {t.registro.sinTarjeta}
          </p>

          <p className="text-xs text-stone-400">{t.registro.politicaPrivacidad}</p>

          <button type="submit" className="btn-primary w-full py-4">
            {t.registro.continuarAlMenu}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/menu" className="text-primary font-medium hover:underline">
            {t.onboarding.saltar} y ver menú
          </Link>
        </p>
      </main>
    </div>
  );
}
