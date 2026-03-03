import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { enviarEmailRecuperacion } from "@/lib/email";
import crypto from "crypto";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// POST: Solicitar recuperación de contraseña
export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Buscar negocio por email
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .select("id, email, activo")
      .eq("email", email)
      .single();

    // Por seguridad, siempre retornamos éxito aunque el email no exista
    // Esto previene enumeración de emails
    if (negocioError || !negocio) {
      return NextResponse.json({
        success: true,
        message:
          "Si el email existe en nuestro sistema, recibirás un enlace de recuperación.",
      });
    }

    if (!negocio.activo) {
      return NextResponse.json({
        success: true,
        message:
          "Si el email existe en nuestro sistema, recibirás un enlace de recuperación.",
      });
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");

    // Expira en 1 hora
    const expiraEn = new Date();
    expiraEn.setHours(expiraEn.getHours() + 1);

    // Guardar token en la base de datos
    const { error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({
        negocio_id: negocio.id,
        token: token,
        email: email,
        expira_en: expiraEn.toISOString(),
        usado: false,
      });

    if (tokenError) {
      console.error("Error guardando token:", tokenError);
      return NextResponse.json(
        { error: "Error al procesar la solicitud" },
        { status: 500 },
      );
    }

    // Enviar email
    const emailEnviado = await enviarEmailRecuperacion(email, token);

    if (!emailEnviado) {
      // Si falla el email, aún retornamos éxito por seguridad
      // pero logueamos el error
      console.error("Error enviando email de recuperación");
    }

    return NextResponse.json({
      success: true,
      message:
        "Si el email existe en nuestro sistema, recibirás un enlace de recuperación.",
    });
  } catch (err) {
    console.error("Error en POST /api/negocios/auth/forgot-password:", err);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
