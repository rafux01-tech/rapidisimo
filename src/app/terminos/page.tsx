"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function TerminosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">
          Términos y Condiciones
        </h1>
        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6 text-stone-700">
          <p className="text-sm text-stone-500">
            Última actualización: {new Date().toLocaleDateString("es-DO")}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar Rapidisimo, aceptas estar sujeto a estos
              Términos y Condiciones. Si no estás de acuerdo con alguna parte de
              estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              2. Descripción del Servicio
            </h2>
            <p>
              Rapidisimo es una plataforma de delivery que conecta clientes con
              negocios locales. Facilitamos la orden y entrega de productos, pero
              no somos responsables de la calidad, preparación o entrega de los
              productos, que es responsabilidad del negocio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              3. Registro y Cuenta
            </h2>
            <p>
              Para realizar pedidos, debes proporcionar información precisa y
              actualizada. Eres responsable de mantener la confidencialidad de tu
              información y de todas las actividades que ocurran bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              4. Pedidos y Pagos
            </h2>
            <p>
              Los precios mostrados son finales e incluyen impuestos aplicables.
              Puedes pagar en efectivo al recibir o con tarjeta según las
              opciones disponibles. Una vez confirmado el pedido, no se puede
              cancelar sin contactar al negocio directamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              5. Garantía y Reembolsos
            </h2>
            <p>
              Rapidisimo garantiza que si tu pedido no llega o no es lo que
              ordenaste, procesaremos un reembolso completo. Debes reportar
              cualquier problema dentro de las 24 horas posteriores a la entrega.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              6. Responsabilidades del Negocio
            </h2>
            <p>
              Los negocios asociados son responsables de la calidad, preparación
              y cumplimiento de los pedidos. Rapidisimo actúa únicamente como
              intermediario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              7. Limitación de Responsabilidad
            </h2>
            <p>
              Rapidisimo no será responsable por daños indirectos, incidentales o
              consecuentes derivados del uso del servicio. Nuestra responsabilidad
              máxima se limita al monto del pedido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              8. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor al publicarse en esta
              página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              9. Contacto
            </h2>
            <p>
              Para cualquier pregunta sobre estos términos, puedes contactarnos a
              través de la sección de ayuda en la aplicación.
            </p>
          </section>

          <div className="border-t border-stone-200 pt-6 mt-8">
            <p className="text-sm text-stone-500">
              <strong>Nota importante:</strong> Estos términos son un borrador
              básico. Se recomienda consultar con un abogado antes del
              lanzamiento público para asegurar cumplimiento con las leyes
              locales de República Dominicana.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-primary hover:underline font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
