"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import type { Locale } from "@/lib/i18n";

export default function Header() {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          {t.appName}
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/menu"
            className="text-stone-600 hover:text-primary font-medium text-sm"
          >
            {t.nav.menu}
          </Link>
          <Link
            href="/carrito"
            className="text-stone-600 hover:text-primary font-medium text-sm"
          >
            {t.nav.carrito}
          </Link>
          <Link
            href="/ayuda"
            className="text-stone-600 hover:text-primary font-medium text-sm"
          >
            {t.nav.ayuda}
          </Link>
          <Link
            href="/soy-negocio"
            className="text-stone-600 hover:text-primary font-medium text-sm"
          >
            {t.nav.soyNegocio}
          </Link>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="text-sm border border-stone-300 rounded-lg px-2 py-1.5 bg-white text-stone-700"
            aria-label={t.nav.idioma}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </nav>
      </div>
    </header>
  );
}
