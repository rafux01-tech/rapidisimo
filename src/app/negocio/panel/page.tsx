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
  const [formImagen, setFormImagen] = useState<File | null>(null);
  const [formImagenPreview, setFormImagenPreview] = useState<string | null>(null);
  const [formImagenUrl, setFormImagenUrl] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Cambiar contraseña
  const [mostrarCambiarPassword, setMostrarCambiarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordNuevaConfirmar, setPasswordNuevaConfirmar] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  // Pedidos
  interface PedidoItem {
    id: string;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
  }

  interface Pedido {
    id: string;
    numero_pedido: string;
    estado: string;
    metodo_pago: string;
    subtotal: number;
    costo_envio: number;
    total: number;
    direccion_entrega: string;
    telefono_cliente?: string;
    notas?: string;
    leido_por_negocio: boolean;
    creado_en: string;
    pedidos_items: PedidoItem[];
  }

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosNoLeidos, setPedidosNoLeidos] = useState(0);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);

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

  // Cargar pedidos y hacer polling para notificaciones
  useEffect(() => {
    if (!autenticado || !negocioId) return;

    async function cargarPedidos() {
      try {
        const res = await fetch(`/api/negocios/pedidos?negocioId=${negocioId}`);
        if (res.ok) {
          const data = await res.json();
          setPedidos(data);
          const noLeidos = data.filter((p: Pedido) => !p.leido_por_negocio).length;
          setPedidosNoLeidos(noLeidos);
        }
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      } finally {
        setCargandoPedidos(false);
      }
    }

    cargarPedidos();
    setCargandoPedidos(true);

    // Polling cada 30 segundos para nuevos pedidos
    const interval = setInterval(cargarPedidos, 30000);

    return () => clearInterval(interval);
  }, [autenticado, negocioId]);

  async function marcarPedidoLeido(pedidoId: string) {
    if (!negocioId) return;

    try {
      const res = await fetch(
        `/api/negocios/pedidos/${pedidoId}/marcar-leido?negocioId=${negocioId}`,
        { method: "PUT" },
      );

      if (res.ok) {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedidoId ? { ...p, leido_por_negocio: true } : p,
          ),
        );
        setPedidosNoLeidos((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marcando pedido como leído:", err);
    }
  }

  async function actualizarEstadoPedido(pedidoId: string, nuevoEstado: string) {
    if (!negocioId) return;

    try {
      const res = await fetch(
        `/api/negocios/pedidos/${pedidoId}/actualizar-estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ negocioId, estado: nuevoEstado }),
        },
      );

      if (res.ok) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p)),
        );
        setMensaje({
          tipo: "exito",
          texto: "Estado del pedido actualizado",
        });
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar estado",
        });
      }
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión",
      });
    }
  }

  function getEstadoLabel(estado: string) {
    const estados: Record<string, string> = {
      pendiente: "Pendiente",
      confirmado: "Confirmado",
      en_preparacion: "En preparación",
      listo: "Listo",
      en_camino: "En camino",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!negocioId) return;

    setEnviando(true);
    setMensaje(null);

    try {
      // Subir imagen si hay una nueva
      let imagenUrlFinal = formImagenUrl;
      if (formImagen) {
        const urlSubida = await subirImagen();
        if (!urlSubida) {
          setEnviando(false);
          return; // Error ya mostrado en subirImagen
        }
        imagenUrlFinal = urlSubida;
      }

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
          imagen_url: imagenUrlFinal || null,
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
    setFormImagen(null);
    setFormImagenPreview(null);
    setFormImagenUrl(null);
  }

  function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(file.type)) {
      setMensaje({
        tipo: "error",
        texto: "Tipo de archivo no permitido. Solo JPG, PNG y WEBP.",
      });
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMensaje({
        tipo: "error",
        texto: "El archivo es demasiado grande. Máximo 5MB.",
      });
      return;
    }

    setFormImagen(file);
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImagenPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function subirImagen(): Promise<string | null> {
    if (!formImagen || !negocioId) return formImagenUrl;

    setSubiendoImagen(true);
    try {
      const formData = new FormData();
      formData.append("file", formImagen);
      formData.append("negocioId", negocioId);

      const res = await fetch("/api/negocios/productos/upload-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const data = await res.json();
        setMensaje({
          tipo: "error",
          texto: data.error || "Error al subir la imagen",
        });
        return null;
      }
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión al subir imagen",
      });
      return null;
    } finally {
      setSubiendoImagen(false);
    }
  }

  function iniciarEdicion(producto: ProductoNegocio) {
    setEditandoProducto(producto);
    setFormNombre(producto.nombre);
    setFormPrecio(producto.precio.toString());
    setFormCategoria(producto.categoria);
    setFormDescripcion(producto.descripcion || "");
    setFormDisponible(producto.disponible);
    setFormImagenUrl(producto.imagen_url || null);
    setFormImagenPreview(producto.imagen_url || null);
    setFormImagen(null);
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

  async function handleCambiarPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!negocioId) return;

    if (passwordNueva !== passwordNuevaConfirmar) {
      setMensaje({
        tipo: "error",
        texto: "Las contraseñas nuevas no coinciden",
      });
      return;
    }

    if (passwordNueva.length < 6) {
      setMensaje({
        tipo: "error",
        texto: "La nueva contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    setCambiandoPassword(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/negocios/auth/cambiar-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          negocioId,
          passwordActual,
          passwordNueva,
        }),
      });

      if (res.ok) {
        setMensaje({
          tipo: "exito",
          texto: "Contraseña actualizada exitosamente",
        });
        setMostrarCambiarPassword(false);
        setPasswordActual("");
        setPasswordNueva("");
        setPasswordNuevaConfirmar("");
        setTimeout(() => setMensaje(null), 5000);
      } else {
        const data = await res.json();
        setMensaje({
          tipo: "error",
          texto: data.error || "Error al cambiar contraseña",
        });
      }
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión. Intenta de nuevo.",
      });
    } finally {
      setCambiandoPassword(false);
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
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900">Configuración de cuenta</h3>
                  <p className="text-sm text-stone-600">Gestiona tu contraseña y preferencias</p>
                </div>
                <button
                  onClick={() => setMostrarCambiarPassword(!mostrarCambiarPassword)}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  {mostrarCambiarPassword ? "Ocultar" : "Cambiar contraseña"}
                </button>
              </div>

              {mostrarCambiarPassword && (
                <form onSubmit={handleCambiarPassword} className="mt-4 space-y-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Contraseña actual *
                    </label>
                    <input
                      type="password"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      required
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Nueva contraseña *
                    </label>
                    <input
                      type="password"
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Confirmar nueva contraseña *
                    </label>
                    <input
                      type="password"
                      value={passwordNuevaConfirmar}
                      onChange={(e) => setPasswordNuevaConfirmar(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cambiandoPassword}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {cambiandoPassword ? "Actualizando..." : "Actualizar contraseña"}
                  </button>
                </form>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-stone-900">
                  Pedidos
                </h2>
                {pedidosNoLeidos > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {pedidosNoLeidos} nuevo{pedidosNoLeidos > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMostrarPedidos(!mostrarPedidos)}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {mostrarPedidos ? "Ocultar" : "Ver pedidos"}
              </button>
            </div>

            {mostrarPedidos && (
              <div className="space-y-4">
                {cargandoPedidos ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                    <p className="text-stone-600">Cargando pedidos...</p>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                    <p className="text-stone-600">
                      Aún no tienes pedidos. Los pedidos aparecerán aquí cuando los clientes hagan pedidos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pedidos.map((pedido) => (
                      <div
                        key={pedido.id}
                        className={`bg-white rounded-2xl border p-4 ${
                          !pedido.leido_por_negocio
                            ? "border-primary shadow-md"
                            : "border-stone-200"
                        }`}
                        onClick={() => {
                          if (!pedido.leido_por_negocio) {
                            marcarPedidoLeido(pedido.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-stone-900">
                                {pedido.numero_pedido}
                              </h3>
                              {!pedido.leido_por_negocio && (
                                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                  Nuevo
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500">
                              {new Date(pedido.creado_en).toLocaleString("es-DO")}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              pedido.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : pedido.estado === "confirmado" ||
                                    pedido.estado === "en_preparacion"
                                ? "bg-blue-100 text-blue-800"
                                : pedido.estado === "listo" ||
                                    pedido.estado === "en_camino"
                                ? "bg-purple-100 text-purple-800"
                                : pedido.estado === "entregado"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getEstadoLabel(pedido.estado)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-3">
                          {pedido.pedidos_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm text-stone-700"
                            >
                              <span>
                                {item.nombre_producto} × {item.cantidad}
                              </span>
                              <span>RD$ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-stone-200 pt-3 space-y-1 mb-3">
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Subtotal:</span>
                            <span>RD$ {pedido.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Envío:</span>
                            <span>RD$ {pedido.costo_envio.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-stone-900 pt-1">
                            <span>Total:</span>
                            <span className="text-primary">
                              RD$ {pedido.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-stone-600 space-y-1 mb-3">
                          <p>
                            <strong>Dirección:</strong> {pedido.direccion_entrega}
                          </p>
                          {pedido.telefono_cliente && (
                            <p>
                              <strong>Teléfono:</strong> {pedido.telefono_cliente}
                            </p>
                          )}
                          {pedido.notas && (
                            <p>
                              <strong>Notas:</strong> {pedido.notas}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {pedido.estado === "pendiente" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actualizarEstadoPedido(pedido.id, "confirmado");
                                }}
                                className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actualizarEstadoPedido(pedido.id, "cancelado");
                                }}
                                className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition-colors"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                          {pedido.estado === "confirmado" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actualizarEstadoPedido(pedido.id, "en_preparacion");
                              }}
                              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                              En preparación
                            </button>
                          )}
                          {pedido.estado === "en_preparacion" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actualizarEstadoPedido(pedido.id, "listo");
                              }}
                              className="text-xs bg-purple-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                            >
                              Marcar como listo
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

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
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Imagen del producto (opcional)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImagenChange}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      Formatos: JPG, PNG, WEBP. Máximo 5MB.
                    </p>
                    {(formImagenPreview || formImagenUrl) && (
                      <div className="mt-3">
                        <p className="text-xs text-stone-600 mb-2">Vista previa:</p>
                        <img
                          src={formImagenPreview || formImagenUrl || ""}
                          alt="Vista previa"
                          className="w-32 h-32 object-cover rounded-lg border border-stone-200"
                        />
                        {formImagen && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormImagen(null);
                              setFormImagenPreview(formImagenUrl);
                            }}
                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Quitar imagen nueva
                          </button>
                        )}
                      </div>
                    )}
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
                      disabled={enviando || subiendoImagen}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {subiendoImagen
                        ? "Subiendo imagen..."
                        : enviando
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
