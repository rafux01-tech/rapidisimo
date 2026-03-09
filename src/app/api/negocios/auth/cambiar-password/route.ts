import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcrypt";

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar autenticación de negocio
async function verificarNegocioAuth(negocioId: string): Promise<boolean> {
  if (!negocioId) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(`negocio_session_${negocioId}`);

  if (session?.value !== "authenticated") return false;

  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("negocios")
      .select("id, activo")
      .eq("id", negocioId)
      .single();

    return !!data && data.activo === true;
  } catch {
    return false;
  }
}

// PUT: Cambiar contraseña del negocio
export async function PUT(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { negocioId, passwordActual, passwordNueva } = body;

    if (!negocioId || !passwordActual || !passwordNueva) {
      return NextResponse.json(
        { error: "negocioId, passwordActual y passwordNueva son requeridos" },
        { status: 400 },
      );
    }

    if (passwordNueva.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    // Verificar autenticación
    const autenticado = await verificarNegocioAuth(negocioId);
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Obtener el negocio y su contraseña actual
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .select("id, password_hash")
      .eq("id", negocioId)
      .single();

    if (negocioError || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 },
      );
    }

    // Verificar contraseña actual
    let passwordActualValida = false;
    if (
      negocio.password_hash.startsWith("$2b$") ||
      negocio.password_hash.startsWith("$2a$")
    ) {
      passwordActualValida = await bcrypt.compare(
        passwordActual,
        negocio.password_hash,
      );
    } else {
      // Legacy: contraseña sin hashear
      passwordActualValida = negocio.password_hash === passwordActual;
    }

    if (!passwordActualValida) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 },
      );
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const passwordHashNueva = await bcrypt.hash(passwordNueva, saltRounds);

    // Actualizar contraseña
    const { error: updateError } = await supabase
      .from("negocios")
      .update({ password_hash: passwordHashNueva })
      .eq("id", negocioId);

    if (updateError) {
      console.error("Error actualizando contraseña:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar contraseña" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error en PUT /api/negocios/auth/cambiar-password:", err);
    return NextResponse.json(
      { error: "Error al cambiar contraseña" },
      { status: 500 },
    );
  }
}
