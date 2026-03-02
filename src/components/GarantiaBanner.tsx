"use client";

import { useLocale } from "@/lib/locale-context";

export default function GarantiaBanner() {
  const { t } = useLocale();
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
      <p className="text-sm font-medium text-primary-dark">
        <strong>{t.garantia.titulo}:</strong> {t.garantia.corta}
      </p>
    </div>
  );
}
