import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

export async function enviarEmailRecuperacion(
  email: string,
  token: string,
): Promise<boolean> {
  if (!resend) {
    console.error("RESEND_API_KEY no configurada. No se puede enviar email.");
    return false;
  }

  const resetUrl = `${baseUrl}/negocio/reset-password?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: "Rapidisimo <noreply@rapidisimo.com>", // Cambiar con tu dominio verificado
      to: email,
      subject: "Recuperación de contraseña - Rapidisimo",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .button { display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
              .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Rapidisimo</h1>
              </div>
              <div class="content">
                <h2>Recuperación de contraseña</h2>
                <p>Hola,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de negocio en Rapidisimo.</p>
                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Restablecer contraseña</a>
                </div>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #6b7280; font-size: 12px;">${resetUrl}</p>
                <div class="warning">
                  <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este email.
                </div>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.</p>
              </div>
              <div class="footer">
                <p>Este es un email automático, por favor no respondas.</p>
                <p>&copy; ${new Date().getFullYear()} Rapidisimo. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Recuperación de contraseña - Rapidisimo

Hola,

Recibimos una solicitud para restablecer la contraseña de tu cuenta de negocio en Rapidisimo.

Haz clic en el siguiente enlace para crear una nueva contraseña:

${resetUrl}

Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este email.

Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.

---
Este es un email automático, por favor no respondas.
© ${new Date().getFullYear()} Rapidisimo. Todos los derechos reservados.
      `,
    });

    if (error) {
      console.error("Error enviando email:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error en enviarEmailRecuperacion:", err);
    return false;
  }
}
