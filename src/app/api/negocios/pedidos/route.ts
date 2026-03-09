import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";

// Forzar renderizado dinámico (usa request.url y cookies)
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

// GET: Obtener pedidos de un negocio
export async function GET(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json([]);
  }

  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get("negocioId");
    const soloNoLeidos = searchParams.get("soloNoLeidos") === "true";

    if (!negocioId) {
      return NextResponse.json(
        { error: "negocioId es requerido" },
        { status: 400 },
      );
    }

    // Verificar autenticación
    const autenticado = await verificarNegocioAuth(negocioId);
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Construir query
    let query = supabase
      .from("pedidos")
      .select(`
        id,
        numero_pedido,
        estado,
        metodo_pago,
        subtotal,
        costo_envio,
        total,
        direccion_entrega,
        telefono_cliente,
        notas,
        leido_por_negocio,
        creado_en,
        pedidos_items (
          id,
          nombre_producto,
          precio_unitario,
          cantidad,
          subtotal
        )
      `)
      .eq("negocio_id", negocioId)
      .order("creado_en", { ascending: false });

    if (soloNoLeidos) {
      query = query.eq("leido_por_negocio", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error obteniendo pedidos:", error);
      return NextResponse.json(
        { error: "Error al cargar pedidos" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Error en GET /api/negocios/pedidos:", err);
    return NextResponse.json(
      { error: "Error al cargar pedidos" },
      { status: 500 },
    );
  }
}
