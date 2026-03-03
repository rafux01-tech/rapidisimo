"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BadgeProteccion from "@/components/BadgeProteccion";
import { useLocale } from "@/lib/locale-context";
import { useCart } from "@/lib/cart-context";
import { categorias } from "@/lib/mock-data";
import type { ProductoAPI } from "@/app/api/productos/route";
import type { Producto } from "@/lib/mock-data";

function getProductName(p: ProductoAPI, locale: string) {
  return locale === "en" && p.nombreEn ? p.nombreEn : p.nombre;
}

function getCategoryName(c: (typeof categorias)[0], locale: string) {
  return locale === "en" && c.nombreEn ? c.nombreEn : c.nombre;
}

// Convertir ProductoAPI a Producto para el carrito
function convertirProducto(p: ProductoAPI): Producto {
  return {
    id: p.id,
    nombre: p.nombre,
    nombreEn: p.nombreEn,
    precio: p.precio,
    categoria: p.categoria,
    categoriaEn: p.categoriaEn,
    imagen: p.imagen,
  };
}

export default function MenuPage() {
  const { t, locale } = useLocale();
  const { addItem, totalItems, subtotal } = useCart();
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].id);
  const [productos, setProductos] = useState<ProductoAPI[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const res = await fetch("/api/productos");
        if (res.ok) {
          const data = (await res.json()) as ProductoAPI[];
          setProductos(data);
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, []);

  // Obtener categorías únicas de los productos reales
  const categoriasReales = Array.from(
    new Set(productos.map((p) => p.categoria)),
  ).map((cat) => ({
    id: cat,
    nombre: cat,
    nombreEn: productos.find((p) => p.categoria === cat)?.categoriaEn || cat,
  }));

  const categoriasParaMostrar =
    categoriasReales.length > 0 ? categoriasReales : categorias;

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

        {categoriasParaMostrar.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button
              onClick={() => setCategoriaActiva("todos")}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm ${
                categoriaActiva === "todos"
                  ? "bg-primary text-white"
                  : "bg-stone-200 text-stone-700"
              }`}
            >
              Todos
            </button>
            {categoriasParaMostrar.map((c) => (
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
        )}

        <p className="text-sm text-stone-600 mb-4 flex items-center gap-2">
          <BadgeProteccion /> {t.menu.pedidoConProteccion}
        </p>

        {cargando ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <p className="text-stone-600">Cargando menú...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <p className="text-stone-700 font-medium mb-2">
              Menú disponible próximamente
            </p>
            <p className="text-sm text-stone-600">
              Estamos trabajando para conectarte con los mejores restaurantes y negocios de tu zona.
              El menú aparecerá aquí cuando los restaurantes se registren y agreguen sus productos.
            </p>
            <Link
              href="/soy-negocio"
              className="inline-block mt-4 text-primary hover:underline text-sm font-medium"
            >
              ¿Tienes un negocio? Regístrate aquí →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {productosFiltrados.map((p) => (
              <li
                key={p.id}
                className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4 shadow-sm"
              >
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={getProductName(p, locale)}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      // Ocultar imagen si falla al cargar
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900">
                    {getProductName(p, locale)}
                  </h3>
                  {p.negocioNombre && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      {p.negocioNombre}
                    </p>
                  )}
                  <p className="text-primary font-semibold mt-1">
                    RD$ {p.precio.toLocaleString("es-DO")}
                  </p>
                </div>
                <button
                  onClick={() => addItem(convertirProducto(p))}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-dark flex-shrink-0"
                >
                  {t.menu.agregar}
                </button>
              </li>
            ))}
          </ul>
        )}

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
