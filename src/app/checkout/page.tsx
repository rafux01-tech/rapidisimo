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
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal + costoEnvio;

  const handleConfirmar = async () => {
    if (items.length === 0) return;

    setEnviando(true);
    setError("");

    try {
      // Obtener datos del cliente desde localStorage
      const clienteId = typeof window !== "undefined" ? localStorage.getItem("cliente_id") : null;
      
      // Obtener dirección del cliente (por ahora usaremos una dirección por defecto o del localStorage)
      const direccionEntrega = typeof window !== "undefined" 
        ? localStorage.getItem("cliente_direccion") || "Dirección no especificada"
        : "Dirección no especificada";

      // Preparar items del pedido
      const itemsPedido = items.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        nombre: locale === "en" && producto.nombreEn ? producto.nombreEn : producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
      }));

      // Crear el pedido
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: clienteId || undefined,
          items: itemsPedido,
          metodoPago: metodoPago,
          direccionEntrega: direccionEntrega,
          telefonoCliente: typeof window !== "undefined" ? localStorage.getItem("cliente_telefono") || undefined : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/pedido/${data.pedido.numeroPedido}`);
      } else {
        const data = await res.json();
        setError(data.error || "Error al crear el pedido. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          onClick={handleConfirmar}
          disabled={enviando}
          className="btn-primary w-full mt-8 py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviando ? "Creando pedido..." : t.checkout.confirmarPedido}
        </button>
      </main>
    </div>
  );
}
