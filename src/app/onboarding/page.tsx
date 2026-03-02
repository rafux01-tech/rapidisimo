"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocale } from "@/lib/locale-context";

const pasos = [
  { key: "paso1Title" as const, descKey: "paso1Desc" as const },
  { key: "paso2Title" as const, descKey: "paso2Desc" as const },
  { key: "paso3Title" as const, descKey: "paso3Desc" as const },
  { key: "paso4Title" as const, descKey: "paso4Desc" as const },
];

export default function OnboardingPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const on = t.onboarding;

  const handleSiguiente = () => {
    if (paso < pasos.length - 1) setPaso((p) => p + 1);
    else router.push("/registro");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              {pasos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= paso ? "bg-primary" : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              {on[pasos[paso].key]}
            </h2>
            <p className="text-stone-600">{on[pasos[paso].descKey]}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/menu"
              className="flex-1 text-center py-3 text-stone-600 font-medium"
            >
              {on.saltar}
            </Link>
            <button
              onClick={handleSiguiente}
              className="flex-1 btn-primary"
            >
              {paso === pasos.length - 1 ? on.empezar : on.siguiente}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
