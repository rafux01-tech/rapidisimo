"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BadgePagoSeguro from "@/components/BadgePagoSeguro";
import BadgeProteccion from "@/components/BadgeProteccion";
import GarantiaBanner from "@/components/GarantiaBanner";
import { useLocale } from "@/lib/locale-context";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/15 to-stone-50 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <BadgePagoSeguro />
              <BadgeProteccion />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t.landing.heroTitle}
            </h1>
            <p className="text-lg text-stone-600 mb-8">
              {t.landing.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/onboarding" className="btn-primary">
                {t.landing.ctaEmpezar}
              </Link>
              <Link href="/menu" className="btn-secondary">
                {t.landing.ctaVerMenu}
              </Link>
            </div>
            <p className="mt-4 text-sm text-stone-500">
              <Link href="/registro" className="text-primary hover:underline">
                {t.landing.irDirectoRegistro}
              </Link>
            </p>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">
            {t.landing.porqueElegirnos}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-trust">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">
                {t.landing.razon1Title}
              </h3>
              <p className="text-stone-600 text-sm">{t.landing.razon1Desc}</p>
            </div>
            <div className="card-trust">
              <div className="w-12 h-12 rounded-full bg-trust/10 flex items-center justify-center mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">
                {t.landing.razon2Title}
              </h3>
              <p className="text-stone-600 text-sm">{t.landing.razon2Desc}</p>
            </div>
            <div className="card-trust">
              <div className="w-12 h-12 rounded-full bg-safe/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">
                {t.landing.razon3Title}
              </h3>
              <p className="text-stone-600 text-sm">{t.landing.razon3Desc}</p>
            </div>
          </div>
        </section>

        {/* Reaseguro miedo estafa */}
        <section className="py-12 px-4 bg-stone-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {t.landing.miedoEstafa}
            </h2>
            <p className="text-stone-600">{t.landing.miedoRespuesta}</p>
          </div>
        </section>

        {/* Garantía */}
        <section className="py-12 px-4 max-w-2xl mx-auto">
          <GarantiaBanner />
        </section>

        {/* Footer mínimo */}
        <footer className="py-6 px-4 border-t border-stone-200 text-center text-sm text-stone-500">
          <p>Rapidisimo — Delivery con garantía. República Dominicana.</p>
        </footer>
      </main>
    </div>
  );
}
