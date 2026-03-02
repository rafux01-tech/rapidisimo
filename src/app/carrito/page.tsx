"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BadgeProteccion from "@/components/BadgeProteccion";
import { useLocale } from "@/lib/locale-context";
import { useCart } from "@/lib/cart-context";

function getProductName(p: { nombre: string; nombreEn?: string }, locale: string) {
  return locale === "en" && p.nombreEn ? p.nombreEn : p.nombre;
}

export default function CarritoPage() {
  const { t, locale } = useLocale();
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-stone-600 mb-4">{t.carrito.vacio}</p>
          <Link href="/menu" className="btn-primary">
            {t.carrito.irAlMenu}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          {t.carrito.titulo}
        </h1>
        <p className="flex items-center gap-2 text-sm text-stone-600 mb-6">
          <BadgeProteccion /> {t.checkout.montoClaro}
        </p>

        <ul className="space-y-4 mb-8">
          {items.map(({ producto, cantidad }) => (
            <li
              key={producto.id}
              className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-stone-900">
                  {getProductName(producto, locale)}
                </h3>
                <p className="text-primary font-medium">
                  RD$ {producto.precio} × {cantidad} = RD$ {producto.precio * cantidad}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(producto.id, cantidad - 1)}
                  className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{cantidad}</span>
                <button
                  onClick={() => updateQuantity(producto.id, cantidad + 1)}
                  className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(producto.id)}
                  className="text-red-600 text-sm ml-2"
                >
                  {t.common.quitar}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-stone-100 rounded-xl p-4 mb-4">
          <div className="flex justify-between text-stone-600 mb-1">
            <span>{t.checkout.subtotal}</span>
            <span>RD$ {subtotal}</span>
          </div>
        </div>

        <Link href="/checkout" className="btn-primary w-full block text-center">
          {t.carrito.continuar}
        </Link>
      </main>
    </div>
  );
}
