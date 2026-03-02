"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import BadgePagoSeguro from "@/components/BadgePagoSeguro";
import BadgeProteccion from "@/components/BadgeProteccion";
import GarantiaBanner from "@/components/GarantiaBanner";
import { useLocale } from "@/lib/locale-context";
import { useCart } from "@/lib/cart-context";
import { costoEnvio } from "@/lib/mock-data";

export default function CheckoutPage() {
  const { t, locale } = useLocale();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "tarjeta">("efectivo");

  const total = subtotal + costoEnvio;

  const handleConfirmar = () => {
    const pedidoId = "PED-" + Date.now();
    clearCart();
    router.push(`/pedido/${pedidoId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-stone-600 mb-4">{t.carrito.vacio}</p>
          <Link href="/menu" className="btn-primary">
            {t.common.irAlMenu}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">
          {t.checkout.titulo}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <BadgePagoSeguro />
          <BadgeProteccion />
        </div>

        <section className="mb-8">
          <h2 className="font-semibold text-stone-900 mb-2">
            {t.checkout.resumen}
          </h2>
          <p className="text-sm text-stone-600 mb-4">{t.checkout.montoClaro}</p>
          <ul className="space-y-2 mb-4">
            {items.map(({ producto, cantidad }) => (
              <li
                key={producto.id}
                className="flex justify-between text-stone-700"
              >
                <span>
                  {locale === "en" && producto.nombreEn
                    ? producto.nombreEn
                    : producto.nombre}{" "}
                  × {cantidad}
                </span>
                <span>RD$ {producto.precio * cantidad}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-stone-200 pt-3 space-y-1">
            <div className="flex justify-between text-stone-600">
              <span>{t.checkout.subtotal}</span>
              <span>RD$ {subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t.checkout.envio}</span>
              <span>RD$ {costoEnvio}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-stone-900 pt-2">
              <span>{t.checkout.total}</span>
              <span className="text-primary">RD$ {total}</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-stone-900 mb-3">
            {t.checkout.metodoPago}
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer border-stone-200 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="pago"
                value="efectivo"
                checked={metodoPago === "efectivo"}
                onChange={() => setMetodoPago("efectivo")}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-stone-900">
                  {t.checkout.pagoRecibir}
                </p>
                <p className="text-sm text-stone-600">
                  {t.checkout.pagoRecibirDesc}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer border-stone-200 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="pago"
                value="tarjeta"
                checked={metodoPago === "tarjeta"}
                onChange={() => setMetodoPago("tarjeta")}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-stone-900">
                  {t.checkout.pagoTarjeta}
                </p>
                <p className="text-sm text-stone-600">
                  {t.checkout.pagoTarjetaDesc}
                </p>
              </div>
            </label>
          </div>
        </section>

        <p className="text-sm text-primary-dark font-medium mb-4">
          {t.checkout.garantiaAntesConfirmar}
        </p>
        <p className="text-sm text-stone-600 mb-6">{t.checkout.reaseguroFooter}</p>

        <GarantiaBanner />

        <button
          onClick={handleConfirmar}
          className="btn-primary w-full mt-8 py-4 text-lg"
        >
          {t.checkout.confirmarPedido}
        </button>
      </main>
    </div>
  );
}
