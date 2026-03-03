"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">
          Política de Privacidad
        </h1>
        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6 text-stone-700">
          <p className="text-sm text-stone-500">
            Última actualización: {new Date().toLocaleDateString("es-DO")}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              1. Información que Recopilamos
            </h2>
            <p className="mb-2">
              Recopilamos la siguiente información cuando utilizas Rapidisimo:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Información de registro:</strong> Nombre, teléfono,
                dirección, email (opcional)
              </li>
              <li>
                <strong>Información de pedidos:</strong> Historial de pedidos,
                preferencias
              </li>
              <li>
                <strong>Información técnica:</strong> Dirección IP, tipo de
                navegador, dispositivo
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              2. Cómo Usamos tu Información
            </h2>
            <p className="mb-2">Utilizamos tu información para:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Procesar y entregar tus pedidos</li>
              <li>Comunicarnos contigo sobre tu pedido</li>
              <li>Mejorar nuestros servicios</li>
              <li>Enviar notificaciones importantes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              3. Compartir Información
            </h2>
            <p>
              Compartimos tu información únicamente con:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <strong>Negocios:</strong> Información necesaria para procesar y
                entregar tu pedido (nombre, teléfono, dirección)
              </li>
              <li>
                <strong>Repartidores:</strong> Información de contacto y
                dirección para la entrega
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Solo lo necesario para
                operar la plataforma (hosting, email)
              </li>
            </ul>
            <p className="mt-3">
              <strong>No vendemos ni alquilamos tu información</strong> a terceros
              para marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              4. Seguridad de Datos
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información personal. Sin embargo, ningún método de
              transmisión por internet es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              5. Tus Derechos
            </h2>
            <p className="mb-2">Tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información incorrecta</li>
              <li>Solicitar eliminación de tu cuenta</li>
              <li>Oponerte al procesamiento de tus datos</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctanos a través de la sección de
              ayuda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              6. Cookies y Tecnologías Similares
            </h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu
              experiencia, analizar el uso del sitio y personalizar contenido.
              Puedes configurar tu navegador para rechazar cookies, aunque esto
              puede afectar algunas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              7. Retención de Datos
            </h2>
            <p>
              Conservamos tu información personal mientras tu cuenta esté activa
              o según sea necesario para cumplir con obligaciones legales. Puedes
              solicitar la eliminación de tu cuenta en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              8. Cambios a esta Política
            </h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te notificaremos
              de cambios significativos publicando la nueva política en esta
              página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              9. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, puedes
              contactarnos a través de la sección de ayuda en la aplicación.
            </p>
          </section>

          <div className="border-t border-stone-200 pt-6 mt-8">
            <p className="text-sm text-stone-500">
              <strong>Nota importante:</strong> Esta política es un borrador
              básico. Se recomienda consultar con un abogado especializado en
              protección de datos antes del lanzamiento público para asegurar
              cumplimiento con las leyes locales de República Dominicana y
              regulaciones internacionales aplicables.
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
