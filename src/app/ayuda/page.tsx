"use client";

import Header from "@/components/Header";
import GarantiaBanner from "@/components/GarantiaBanner";
import { useLocale } from "@/lib/locale-context";

export default function AyudaPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          {t.ayuda.titulo}
        </h1>
        <p className="text-stone-600 mb-8">{t.ayuda.subtitulo}</p>

        <div className="space-y-4 mb-8">
          <a
            href="https://wa.me/18095551234"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
          >
            <span className="text-3xl">💬</span>
            <div>
              <p className="font-semibold text-stone-900">{t.ayuda.chat}</p>
              <p className="text-sm text-stone-600">WhatsApp · Respuesta rápida</p>
            </div>
          </a>
          <a
            href="tel:+18095551234"
            className="flex items-center gap-4 p-4 bg-stone-100 border border-stone-200 rounded-xl hover:bg-stone-200 transition-colors"
          >
            <span className="text-3xl">📞</span>
            <div>
              <p className="font-semibold text-stone-900">{t.ayuda.telefono}</p>
              <p className="text-sm text-stone-600">+1 (809) 555-1234</p>
            </div>
          </a>
        </div>

        <GarantiaBanner />

        <div className="mt-6 p-4 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-600">{t.ayuda.garantiaTexto}</p>
        </div>

        <section className="mt-8">
          <h2 className="font-semibold text-stone-900 mb-4">Preguntas frecuentes</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium text-stone-900">{t.objeciones.meEstafan}</dt>
              <dd className="text-stone-600 text-sm mt-1">{t.objeciones.meEstafanR}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900">{t.objeciones.vendenDatos}</dt>
              <dd className="text-stone-600 text-sm mt-1">{t.objeciones.vendenDatosR}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900">{t.objeciones.cobranDeMas}</dt>
              <dd className="text-stone-600 text-sm mt-1">{t.objeciones.cobranDeMasR}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
