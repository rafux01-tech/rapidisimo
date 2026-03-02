"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BadgeProteccion from "@/components/BadgeProteccion";
import { useLocale } from "@/lib/locale-context";
import { useCart } from "@/lib/cart-context";
import { categorias, productos } from "@/lib/mock-data";

function getProductName(p: (typeof productos)[0], locale: string) {
  return locale === "en" && p.nombreEn ? p.nombreEn : p.nombre;
}

function getCategoryName(c: (typeof categorias)[0], locale: string) {
  return locale === "en" && c.nombreEn ? c.nombreEn : c.nombre;
}

export default function MenuPage() {
  const { t, locale } = useLocale();
  const { addItem, totalItems, subtotal } = useCart();
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].id);

  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">{t.menu.titulo}</h1>
          <Link
            href="/carrito"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium"
          >
            <span>{t.menu.carrito}</span>
            {totalItems > 0 && (
              <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaActiva(c.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm ${
                categoriaActiva === c.id
                  ? "bg-primary text-white"
                  : "bg-stone-200 text-stone-700"
              }`}
            >
              {getCategoryName(c, locale)}
            </button>
          ))}
        </div>

        <p className="text-sm text-stone-600 mb-4 flex items-center gap-2">
          <BadgeProteccion /> {t.menu.pedidoConProteccion}
        </p>

        <ul className="space-y-4">
          {productosFiltrados.map((p) => (
            <li
              key={p.id}
              className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-stone-900">
                  {getProductName(p, locale)}
                </h3>
                <p className="text-primary font-semibold">
                  RD$ {p.precio}
                </p>
              </div>
              <button
                onClick={() => addItem(p)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-dark"
              >
                {t.menu.agregar}
              </button>
            </li>
          ))}
        </ul>

        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">{t.common.total}</p>
                <p className="text-xl font-bold text-primary">
                  RD$ {subtotal}
                </p>
              </div>
              <Link href="/carrito" className="btn-primary">
                {t.carrito.continuar}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
