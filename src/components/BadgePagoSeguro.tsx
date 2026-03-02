"use client";

import { useLocale } from "@/lib/locale-context";

export default function BadgePagoSeguro() {
  const { t } = useLocale();
  return (
    <span className="badge-safe" role="img" aria-hidden>
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      {t.badges.pagoSeguro}
    </span>
  );
}
