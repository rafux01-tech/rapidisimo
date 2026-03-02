"use client";

import { FormEvent, useState } from "react";
import Header from "@/components/Header";
import { useLocale } from "@/lib/locale-context";

export default function SoyNegocioPage() {
  const { t } = useLocale();
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      nombreNegocio: (form.elements.namedItem("nombreNegocio") as HTMLInputElement)?.value,
      contactoNombre: (form.elements.namedItem("contactoNombre") as HTMLInputElement)?.value,
      contactoTelefono: (form.elements.namedItem("contactoTelefono") as HTMLInputElement)?.value,
      direccion: (form.elements.namedItem("direccion") as HTMLInputElement)?.value,
      tipoNegocio: (form.elements.namedItem("tipoNegocio") as HTMLInputElement)?.value,
      horario: (form.elements.namedItem("horario") as HTMLInputElement)?.value,
    };

    setEnviando(true);
    setError(null);

    try {
      const res = await fetch("/api/negocios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("No se pudo enviar la solicitud. Intenta de nuevo.");
      }

      setEnviado(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Hubo un problema enviando tu solicitud. Intenta nuevamente en unos minutos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1">
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              {t.soyNegocio.titulo}
            </h1>
            <p className="text-stone-600 mb-6 text-sm md:text-base">
              {t.soyNegocio.subtitulo}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <h2 className="font-semibold text-stone-900">
                  {t.soyNegocio.bloqueComoFuncionaTitulo}
                </h2>
                <ul className="space-y-2 text-sm text-stone-700">
                  <li>• {t.soyNegocio.bloqueComoFunciona1}</li>
                  <li>• {t.soyNegocio.bloqueComoFunciona2}</li>
                  <li>• {t.soyNegocio.bloqueComoFunciona3}</li>
                </ul>
              </div>
              <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-stone-700">
                <p className="font-semibold mb-1">¿Por qué hacemos esto?</p>
                <p>
                  Muchos negocios en RD han tenido malas experiencias cobrando por delivery
                  o con plataformas que no responden. Rapidisimo nace para que{" "}
                  <span className="font-semibold">
                    ni el cliente ni el negocio se sientan desprotegidos.
                  </span>
                </p>
              </div>
            </div>

            {enviado ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-4">
                <p className="font-semibold text-emerald-800">
                  {t.soyNegocio.enviadoTitulo}
                </p>
                <p className="text-sm text-emerald-900">
                  {t.soyNegocio.enviadoDescripcion}
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 mb-4 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-semibold text-stone-900">
                {t.soyNegocio.formularioTitulo}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="nombreNegocio"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.nombreNegocio}
                  </label>
                  <input
                    id="nombreNegocio"
                    name="nombreNegocio"
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    placeholder={t.soyNegocio.nombreNegocioPlaceholder}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="contactoNombre"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.contactoNombre}
                  </label>
                  <input
                    id="contactoNombre"
                    name="contactoNombre"
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="contactoTelefono"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.contactoTelefono}
                  </label>
                  <input
                    id="contactoTelefono"
                    name="contactoTelefono"
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    placeholder={t.soyNegocio.contactoTelefonoPlaceholder}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="direccion"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.direccion}
                  </label>
                  <input
                    id="direccion"
                    name="direccion"
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    placeholder={t.soyNegocio.direccionPlaceholder}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="tipoNegocio"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.tipoNegocio}
                  </label>
                  <input
                    id="tipoNegocio"
                    name="tipoNegocio"
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    placeholder={t.soyNegocio.tipoNegocioPlaceholder}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="horario"
                    className="text-sm font-medium text-stone-800"
                  >
                    {t.soyNegocio.horario}
                  </label>
                  <input
                    id="horario"
                    name="horario"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    placeholder={t.soyNegocio.horarioPlaceholder}
                  />
                </div>
              </div>

              <p className="text-xs text-stone-500">
                {t.soyNegocio.avisoPrivacidad}
              </p>

              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold px-4 py-2.5 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {enviando ? "Enviando..." : t.soyNegocio.btnEnviar}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

