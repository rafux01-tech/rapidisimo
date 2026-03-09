import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";

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

// PUT: Actualizar estado del pedido
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const pedidoId = params.id;
    const body = await request.json();
    const { negocioId, estado } = body;

    if (!negocioId || !estado) {
      return NextResponse.json(
        { error: "negocioId y estado son requeridos" },
        { status: 400 },
      );
    }

    const estadosValidos = [
      "pendiente",
      "confirmado",
      "en_preparacion",
      "listo",
      "en_camino",
      "entregado",
      "cancelado",
    ];

    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 },
      );
    }

    // Verificar autenticación
    const autenticado = await verificarNegocioAuth(negocioId);
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Verificar que el pedido pertenece al negocio
    const { data: pedidoExistente } = await supabase
      .from("pedidos")
      .select("negocio_id")
      .eq("id", pedidoId)
      .single();

    if (!pedidoExistente || pedidoExistente.negocio_id !== negocioId) {
      return NextResponse.json(
        { error: "Pedido no encontrado o no autorizado" },
        { status: 404 },
      );
    }

    // Actualizar estado
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: estado })
      .eq("id", pedidoId);

    if (error) {
      console.error("Error actualizando estado del pedido:", error);
      return NextResponse.json(
        { error: "Error al actualizar pedido" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error en PUT /api/negocios/pedidos/[id]/actualizar-estado:", err);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 },
    );
  }
}
