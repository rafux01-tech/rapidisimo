"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

interface ProductoNegocio {
  id: string;
  nombre: string;
  nombre_en?: string;
  precio: number;
  categoria: string;
  categoria_en?: string;
  descripcion?: string;
  imagen_url?: string;
  disponible: boolean;
  creado_en: string;
}

export default function NegocioPanelPage() {
  const router = useRouter();
  const [negocioId, setNegocioId] = useState<string | null>(null);
  const [negocioNombre, setNegocioNombre] = useState<string>("");
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [productos, setProductos] = useState<ProductoNegocio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<ProductoNegocio | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Formulario
  const [formNombre, setFormNombre] = useState("");
  const [formPrecio, setFormPrecio] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formDisponible, setFormDisponible] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (typeof window === "undefined") return;

    const id = localStorage.getItem("negocio_id");
    const nombre = localStorage.getItem("negocio_nombre");

    if (!id) {
      router.push("/negocio/login");
      return;
    }

    setNegocioId(id);
    setNegocioNombre(nombre || "");

    async function verificar() {
      try {
        const res = await fetch(`/api/negocios/auth/check?negocioId=${id}`);
        const data = await res.json();
        if (data.authenticated) {
          setAutenticado(true);
          setNegocioNombre(data.negocio.nombre);
        } else {
          localStorage.removeItem("negocio_id");
          localStorage.removeItem("negocio_nombre");
          router.push("/negocio/login");
        }
      } catch {
        router.push("/negocio/login");
      } finally {
        setCargando(false);
      }
    }

    verificar();
  }, [router]);

  // Cargar productos
  useEffect(() => {
    if (!autenticado || !negocioId) return;

    async function cargar() {
      try {
        const res = await fetch(`/api/negocios/productos?negocioId=${negocioId}`);
        if (res.ok) {
          const data = await res.json();
          setProductos(data);
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    }

    cargar();
  }, [autenticado, negocioId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!negocioId) return;

    setEnviando(true);
    setMensaje(null);

    try {
      const url = editandoProducto
        ? `/api/negocios/productos/${editandoProducto.id}`
        : "/api/negocios/productos";
      const method = editandoProducto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          negocioId,
          nombre: formNombre,
          precio: formPrecio,
          categoria: formCategoria,
          descripcion: formDescripcion || null,
          disponible: formDisponible,
        }),
      });

      if (res.ok) {
        setMensaje({
          tipo: "exito",
          texto: editandoProducto
            ? "Producto actualizado exitosamente"
            : "Producto agregado exitosamente",
        });
        setMostrarFormulario(false);
        setEditandoProducto(null);
        resetFormulario();
        // Recargar productos
        const resProductos = await fetch(`/api/negocios/productos?negocioId=${negocioId}`);
        if (resProductos.ok) {
          const data = await resProductos.json();
          setProductos(data);
        }
        setTimeout(() => setMensaje(null), 5000);
      } else {
        const data = await res.json();
        setMensaje({
          tipo: "error",
          texto: data.error || "Error al guardar producto",
        });
      }
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión. Intenta de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  }

  function resetFormulario() {
    setFormNombre("");
    setFormPrecio("");
    setFormCategoria("");
    setFormDescripcion("");
    setFormDisponible(true);
  }

  function iniciarEdicion(producto: ProductoNegocio) {
    setEditandoProducto(producto);
    setFormNombre(producto.nombre);
    setFormPrecio(producto.precio.toString());
    setFormCategoria(producto.categoria);
    setFormDescripcion(producto.descripcion || "");
    setFormDisponible(producto.disponible);
    setMostrarFormulario(true);
  }

  function cancelarEdicion() {
    setEditandoProducto(null);
    setMostrarFormulario(false);
    resetFormulario();
  }

  async function handleEliminar(productoId: string) {
    if (!negocioId) return;
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(
        `/api/negocios/productos/${productoId}?negocioId=${negocioId}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setMensaje({ tipo: "exito", texto: "Producto eliminado exitosamente" });
        setProductos(productos.filter((p) => p.id !== productoId));
        setTimeout(() => setMensaje(null), 5000);
      } else {
        setMensaje({ tipo: "error", texto: "Error al eliminar producto" });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error de conexión" });
    }
  }

  async function handleLogout() {
    if (negocioId) {
      await fetch("/api/negocios/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negocioId }),
      });
    }
    localStorage.removeItem("negocio_id");
    localStorage.removeItem("negocio_nombre");
    router.push("/negocio/login");
    router.refresh();
  }

  if (cargando || autenticado === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Verificando acceso...</p>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  const categoriasDisponibles = [
    "Comida",
    "Bebidas",
    "Postres",
    "Snacks",
    "Limpieza",
    "Abarrotes",
    "Lácteos",
    "Panadería",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Panel de Negocio
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                  {negocioNombre || "Mi Negocio"}
                </h1>
                <p className="text-sm text-stone-600 max-w-2xl">
                  Gestiona tus productos, actualiza precios y disponibilidad.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {mensaje && (
            <div
              className={`rounded-xl border p-4 ${
                mensaje.tipo === "exito"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{mensaje.texto}</p>
            </div>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                Mis Productos ({productos.length})
              </h2>
              <button
                onClick={() => {
                  if (mostrarFormulario) {
                    cancelarEdicion();
                  } else {
                    setMostrarFormulario(true);
                    resetFormulario();
                  }
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                {mostrarFormulario ? "Cancelar" : "+ Agregar Producto"}
              </button>
            </div>

            {mostrarFormulario && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-900 mb-4">
                  {editandoProducto ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Nombre del producto *
                      </label>
                      <input
                        type="text"
                        value={formNombre}
                        onChange={(e) => setFormNombre(e.target.value)}
                        required
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        placeholder="Ej: Pollo Frito Completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Precio (RD$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formPrecio}
                        onChange={(e) => setFormPrecio(e.target.value)}
                        required
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        placeholder="250.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      required
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categoriasDisponibles.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={formDescripcion}
                      onChange={(e) => setFormDescripcion(e.target.value)}
                      rows={3}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="Describe tu producto..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="disponible"
                      checked={formDisponible}
                      onChange={(e) => setFormDisponible(e.target.checked)}
                      className="w-4 h-4 text-primary border-stone-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="disponible" className="text-sm text-stone-700">
                      Producto disponible
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={enviando}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {enviando
                        ? "Guardando..."
                        : editandoProducto
                          ? "Actualizar"
                          : "Agregar Producto"}
                    </button>
                    {editandoProducto && (
                      <button
                        type="button"
                        onClick={cancelarEdicion}
                        className="bg-stone-200 text-stone-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-stone-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {productos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                <p className="text-stone-600 mb-4">
                  Aún no tienes productos. Agrega tu primer producto para comenzar.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <tr>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Categoría</th>
                      <th className="px-4 py-2">Precio</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-stone-100 hover:bg-stone-50/80"
                      >
                        <td className="px-4 py-2 text-stone-800 font-medium">
                          {p.nombre}
                        </td>
                        <td className="px-4 py-2 text-stone-700">{p.categoria}</td>
                        <td className="px-4 py-2 text-stone-800">
                          RD$ {p.precio.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              p.disponible
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.disponible ? "Disponible" : "No disponible"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => iniciarEdicion(p)}
                              className="text-xs bg-stone-200 text-stone-700 px-3 py-1 rounded-lg hover:bg-stone-300 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminar(p.id)}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
