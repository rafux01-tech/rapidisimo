"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useLocale } from "@/lib/locale-context";
import {
  negociosLeadsAdminMock,
  pedidosAdminMock,
} from "@/lib/admin-mock";
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

  const [negociosLeads, setNegociosLeads] = useState<NegocioLeadStored[]>([]);
  const [cargandoLeads, setCargandoLeads] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const res = await fetch("/api/negocios");
        if (!res.ok) throw new Error("Error cargando leads");
        const data = (await res.json()) as NegocioLeadStored[];
        if (!cancelado) {
          setNegociosLeads(data);
        }
      } catch {
        // Si falla, dejamos solo los mocks en la tabla de ejemplo.
      } finally {
        if (!cancelado) setCargandoLeads(false);
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, []);

  const pedidosHoy = pedidosAdminMock.length;
  const montoHoy = pedidosAdminMock.reduce((acc, p) => acc + p.total, 0);
  const leadsNuevos =
    negociosLeads.filter((l) => l.estado === "nuevo").length +
    negociosLeadsAdminMock.filter((l) => l.estado === "nuevo").length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="space-y-1">
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
          </header>

          <section className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                Pedidos de hoy (mock)
              </p>
              <p className="text-2xl font-bold text-stone-900">
                {pedidosHoy}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                Monto movido hoy (RD$ - mock)
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
                Pedidos recientes (ejemplo)
              </h2>
              <p className="text-xs text-stone-500">
                Estos datos son de prueba, solo para que veas cómo se vería el
                panel.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Cliente</th>
                    <th className="px-4 py-2">Restaurante</th>
                    <th className="px-4 py-2">Sector</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Hace</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosAdminMock.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-stone-100 hover:bg-stone-50/80"
                    >
                      <td className="px-4 py-2 font-mono text-xs text-stone-700">
                        {p.id}
                      </td>
                      <td className="px-4 py-2 text-stone-800">
                        {p.cliente}
                      </td>
                      <td className="px-4 py-2 text-stone-800">
                        {p.restaurante}
                      </td>
                      <td className="px-4 py-2 text-stone-700">
                        {p.sector}
                      </td>
                      <td className="px-4 py-2 text-stone-800">
                        RD${" "}
                        {p.total.toLocaleString("es-DO", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-4 py-2 text-stone-700">
                        {getEstadoPedidoLabel(p.estado)}
                      </td>
                      <td className="px-4 py-2 text-stone-500 text-xs">
                        {p.creadoHaceMin} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {(negociosLeads.length > 0
                    ? negociosLeads
                    : negociosLeadsAdminMock
                  ).map((n) => (
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
                      <td className="px-4 py-2 text-stone-700">
                        {n.sector}
                      </td>
                      <td className="px-4 py-2 text-stone-700">
                        {n.tipoNegocio}
                      </td>
                      <td className="px-4 py-2 text-stone-700">
                        {getEstadoLeadLabel(n.estado)}
                      </td>
                      <td className="px-4 py-2 text-stone-500 text-xs">
                        {n.creadoHaceHoras} h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

