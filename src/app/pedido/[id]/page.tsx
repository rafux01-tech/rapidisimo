"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import BadgeRepartidorVerificado from "@/components/BadgeRepartidorVerificado";
import { useLocale } from "@/lib/locale-context";

const estados = [
  "confirmado",
  "enPreparacion",
  "repartidorAsignado",
  "enCamino",
  "entregado",
] as const;

export default function PedidoPage() {
  const { id } = useParams();
  const { t } = useLocale();
  const pasoActual = 2;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-stone-500 mb-1">Pedido</p>
          <h1 className="text-2xl font-bold text-stone-900">{id}</h1>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-stone-900 mb-4">
            {t.tracking.seguimientoEnVivo}
          </h2>
          <div className="relative">
            {estados.map((estado, i) => (
              <div key={estado} className="flex gap-4 mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i <= pasoActual ? "bg-primary text-white" : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {i < pasoActual ? "✓" : i + 1}
                </div>
                <div className="pb-4">
                  <p
                    className={`font-medium ${
                      i <= pasoActual ? "text-stone-900" : "text-stone-500"
                    }`}
                  >
                    {t.tracking[estado]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-trust mb-6">
          <h3 className="font-semibold text-stone-900 mb-2 flex items-center gap-2">
            {t.tracking.repartidor}
            <BadgeRepartidorVerificado />
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              JM
            </div>
            <div>
              <p className="font-medium text-stone-900">Juan Martínez</p>
              <p className="text-sm text-stone-500">{t.badges.repartidorVerificado}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-900">
            {t.tracking.problemaPedido}
          </p>
          <Link
            href="/ayuda"
            className="inline-block mt-2 font-medium text-primary hover:underline"
          >
            {t.tracking.btnReclamar}
          </Link>
        </div>

        <Link href="/menu" className="btn-secondary w-full block text-center">
          {t.common.otroPedido}
        </Link>
      </main>
    </div>
  );
}
