"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useLocale } from "@/lib/locale-context";
// Removidos los mocks - solo datos reales
import type { NegocioLeadStored } from "@/app/api/negocios/route";

function getEstadoPedidoLabel(estado: string) {
  switch (estado) {
    case "pendiente":
      return "Pendiente";
    case "en_preparacion":
      return "En preparación";
    case "en_camino":
      return "En camino";
    case "entregado":
      return "Entregado";
    case "problema":
      return "Con problema";
    default:
      return estado;
  }
}

function getEstadoLeadLabel(estado: string) {
  switch (estado) {
    case "nuevo":
      return "Nuevo";
    case "contactado":
      return "Contactado";
    case "activado":
      return "Activado";
    default:
      return estado;
  }
}

export default function AdminPage() {
  const { t } = useLocale();
  const router = useRouter();

  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [negociosLeads, setNegociosLeads] = useState<NegocioLeadStored[]>([]);
  const [cargandoLeads, setCargandoLeads] = useState(true);

  // Verificar autenticación
  useEffect(() => {
    async function verificarAuth() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (data.authenticated) {
          setAutenticado(true);
        } else {
          setAutenticado(false);
          router.push("/admin/login");
        }
      } catch {
        setAutenticado(false);
        router.push("/admin/login");
      }
    }
    verificarAuth();
  }, [router]);

  useEffect(() => {
    if (!autenticado) return;

    let cancelado = false;

    async function cargar() {
      try {
        const res = await fetch("/api/negocios");
        if (!res.ok) throw new Error("Error cargando leads");
        const data = (await res.json()) as NegocioLeadStored[];
        if (!cancelado) {
          setNegociosLeads(data);
        }
      } catch (err) {
        console.error("Error cargando leads:", err);
      } finally {
        if (!cancelado) setCargandoLeads(false);
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [autenticado]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // Mostrar loading mientras verifica autenticación
  if (autenticado === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Verificando acceso...</p>
      </div>
    );
  }

  // Si no está autenticado, el useEffect ya redirige
  if (!autenticado) {
    return null;
  }

  // Pedidos: por ahora 0 hasta que implementemos el sistema de pedidos real
  const pedidosHoy = 0;
  const montoHoy = 0;
  const leadsNuevos = negociosLeads.filter((l) => l.estado === "nuevo").length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Panel interno
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                  {t.appName} Admin
                </h1>
                <p className="text-sm text-stone-600 max-w-2xl">
                  Vista rápida para que como dueño veas qué está pasando: pedidos
                  del día, dinero movido y negocios interesados en conectarse.
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

          <section className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                Pedidos de hoy
              </p>
              <p className="text-2xl font-bold text-stone-900">
                {pedidosHoy}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                Monto movido hoy (RD$)
              </p>
              <p className="text-2xl font-bold text-stone-900">
                RD${" "}
                {montoHoy.toLocaleString("es-DO", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                Leads nuevos de negocio
              </p>
              <p className="text-2xl font-bold text-stone-900">
                {leadsNuevos}
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                Pedidos recientes
              </h2>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <p className="text-stone-600">
                El sistema de pedidos estará disponible próximamente.
              </p>
              <p className="text-sm text-stone-500 mt-2">
                Los pedidos reales aparecerán aquí cuando los clientes comiencen a hacer pedidos.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                Negocios interesados
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Negocio</th>
                    <th className="px-4 py-2">Contacto</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Sector</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Hace</th>
                  </tr>
                </thead>
                <tbody>
                  {negociosLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-stone-500"
                      >
                        {cargandoLeads
                          ? "Cargando..."
                          : "Aún no hay negocios interesados. Los leads aparecerán aquí cuando se registren desde el formulario."}
                      </td>
                    </tr>
                  ) : (
                    negociosLeads.map((n) => {
                      const sector = n.direccion || "N/A";
                      const creadoHaceHoras = n.creadoEn
                        ? Math.floor(
                            (Date.now() - new Date(n.creadoEn).getTime()) /
                              (1000 * 60 * 60),
                          )
                        : 0;

                    return (
                      <tr
                        key={n.id}
                        className="border-t border-stone-100 hover:bg-stone-50/80"
                      >
                        <td className="px-4 py-2 font-mono text-xs text-stone-700">
                          {n.id}
                        </td>
                        <td className="px-4 py-2 text-stone-800">
                          {n.nombreNegocio}
                        </td>
                        <td className="px-4 py-2 text-stone-800">
                          {n.contactoNombre}
                        </td>
                        <td className="px-4 py-2 text-stone-700">
                          {n.contactoTelefono}
                        </td>
                        <td className="px-4 py-2 text-stone-700">{sector}</td>
                        <td className="px-4 py-2 text-stone-700">
                          {n.tipoNegocio}
                        </td>
                        <td className="px-4 py-2 text-stone-700">
                          {getEstadoLeadLabel(n.estado)}
                        </td>
                        <td className="px-4 py-2 text-stone-500 text-xs">
                          {creadoHaceHoras} h
                        </td>
                      </tr>
                    );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

