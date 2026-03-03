import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcrypt";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Buscar negocio por email
    const { data: negocio, error } = await supabase
      .from("negocios")
      .select("id, nombre_negocio, email, password_hash, activo")
      .eq("email", email)
      .single();

    if (error || !negocio) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    // Verificar contraseña usando bcrypt
    // Soporta tanto contraseñas hasheadas (nuevas) como sin hashear (legacy)
    let passwordValid = false;
    if (negocio.password_hash.startsWith("$2b$") || negocio.password_hash.startsWith("$2a$")) {
      // Contraseña hasheada con bcrypt
      passwordValid = await bcrypt.compare(password, negocio.password_hash);
    } else {
      // Contraseña legacy sin hashear (para migración gradual)
      passwordValid = negocio.password_hash === password;
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    if (!negocio.activo) {
      return NextResponse.json(
        { error: "Tu negocio no está activo. Contacta al administrador." },
        { status: 403 },
      );
    }

    // Actualizar último login
    await supabase
      .from("negocios")
      .update({ ultimo_login: new Date().toISOString() })
      .eq("id", negocio.id);

    // Crear cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set(`negocio_session_${negocio.id}`, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return NextResponse.json({
      success: true,
      negocio: {
        id: negocio.id,
        nombre: negocio.nombre_negocio,
        email: negocio.email,
      },
    });
  } catch (err) {
    console.error("Error en login de negocio:", err);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
