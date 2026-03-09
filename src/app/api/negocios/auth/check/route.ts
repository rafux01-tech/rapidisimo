import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";

// Forzar renderizado dinámico (usa request.url y cookies)
export const dynamic = 'force-dynamic';

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get("negocioId");

    if (!negocioId) {
      return NextResponse.json({ authenticated: false });
    }

    const cookieStore = await cookies();
    const session = cookieStore.get(`negocio_session_${negocioId}`);

    if (session?.value !== "authenticated") {
      return NextResponse.json({ authenticated: false });
    }

    // Verificar que el negocio existe y está activo
    const supabase = getSupabaseClient();
    const { data: negocio, error } = await supabase
      .from("negocios")
      .select("id, nombre_negocio, activo")
      .eq("id", negocioId)
      .single();

    if (error || !negocio || !negocio.activo) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      negocio: {
        id: negocio.id,
        nombre: negocio.nombre_negocio,
      },
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}
