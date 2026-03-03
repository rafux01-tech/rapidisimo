import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcrypt";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// POST: Resetear contraseña con token
export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { token, nuevaPassword } = body;

    if (!token || !nuevaPassword) {
      return NextResponse.json(
        { error: "Token y nueva contraseña son requeridos" },
        { status: 400 },
      );
    }

    if (nuevaPassword.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Buscar token válido
    const { data: resetToken, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("id, negocio_id, email, usado, expira_en")
      .eq("token", token)
      .single();

    if (tokenError || !resetToken) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 },
      );
    }

    // Verificar que el token no haya sido usado
    if (resetToken.usado) {
      return NextResponse.json(
        { error: "Este token ya fue utilizado" },
        { status: 400 },
      );
    }

    // Verificar que el token no haya expirado
    const ahora = new Date();
    const expiraEn = new Date(resetToken.expira_en);
    if (ahora > expiraEn) {
      return NextResponse.json(
        { error: "Token expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(nuevaPassword, saltRounds);

    // Actualizar contraseña del negocio
    const { error: updateError } = await supabase
      .from("negocios")
      .update({ password_hash: passwordHash })
      .eq("id", resetToken.negocio_id);

    if (updateError) {
      console.error("Error actualizando contraseña:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la contraseña" },
        { status: 500 },
      );
    }

    // Marcar token como usado
    await supabase
      .from("password_reset_tokens")
      .update({ usado: true })
      .eq("id", resetToken.id);

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (err) {
    console.error("Error en POST /api/negocios/auth/reset-password:", err);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}

// GET: Verificar si un token es válido
export async function GET(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json({ valid: false });
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false });
    }

    const supabase = getSupabaseClient();

    const { data: resetToken, error } = await supabase
      .from("password_reset_tokens")
      .select("id, usado, expira_en")
      .eq("token", token)
      .single();

    if (error || !resetToken) {
      return NextResponse.json({ valid: false });
    }

    // Verificar que no haya sido usado
    if (resetToken.usado) {
      return NextResponse.json({ valid: false, reason: "used" });
    }

    // Verificar que no haya expirado
    const ahora = new Date();
    const expiraEn = new Date(resetToken.expira_en);
    if (ahora > expiraEn) {
      return NextResponse.json({ valid: false, reason: "expired" });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    return NextResponse.json({ valid: false });
  }
}
