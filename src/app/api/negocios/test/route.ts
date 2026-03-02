import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// Endpoint de prueba para verificar conexión con Supabase
export async function GET() {
  const tieneSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!tieneSupabase) {
    return NextResponse.json(
      {
        configurado: false,
        mensaje:
          "Supabase no está configurado. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
        variables: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || "NO CONFIGURADA",
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "CONFIGURADA (oculta)"
            : "NO CONFIGURADA",
        },
      },
      { status: 200 },
    );
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from("negocios_leads")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          configurado: true,
          conectado: false,
          error: error.message,
          codigo: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      configurado: true,
      conectado: true,
      mensaje: "Conexión exitosa con Supabase",
      totalRegistros: count || 0,
      ejemploRegistro: data?.[0] || null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        configurado: true,
        conectado: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
