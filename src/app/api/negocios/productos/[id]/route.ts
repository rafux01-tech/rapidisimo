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

// PUT: Actualizar producto
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
    const productoId = params.id;
    const body = await request.json();
    const { negocioId, nombre, precio, categoria, descripcion, imagen_url, disponible, categoria_en, nombre_en } = body;

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

    // Verificar que el producto pertenece al negocio
    const supabase = getSupabaseClient();
    const { data: productoExistente } = await supabase
      .from("productos")
      .select("negocio_id")
      .eq("id", productoId)
      .single();

    if (!productoExistente || productoExistente.negocio_id !== negocioId) {
      return NextResponse.json(
        { error: "Producto no encontrado o no autorizado" },
        { status: 404 },
      );
    }

    // Actualizar producto
    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (nombre_en !== undefined) updateData.nombre_en = nombre_en;
    if (precio !== undefined) updateData.precio = Number(precio);
    if (categoria !== undefined) updateData.categoria = categoria;
    if (categoria_en !== undefined) updateData.categoria_en = categoria_en;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (imagen_url !== undefined) updateData.imagen_url = imagen_url;
    if (disponible !== undefined) updateData.disponible = disponible;

    const { data, error } = await supabase
      .from("productos")
      .update(updateData)
      .eq("id", productoId)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando producto:", error);
      return NextResponse.json(
        { error: "Error al actualizar producto" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error en PUT /api/negocios/productos/[id]:", err);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar producto
export async function DELETE(
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
    const productoId = params.id;
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get("negocioId");

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

    // Verificar que el producto pertenece al negocio
    const { data: productoExistente } = await supabase
      .from("productos")
      .select("negocio_id")
      .eq("id", productoId)
      .single();

    if (!productoExistente || productoExistente.negocio_id !== negocioId) {
      return NextResponse.json(
        { error: "Producto no encontrado o no autorizado" },
        { status: 404 },
      );
    }

    // Eliminar producto
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", productoId);

    if (error) {
      console.error("Error eliminando producto:", error);
      return NextResponse.json(
        { error: "Error al eliminar producto" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error en DELETE /api/negocios/productos/[id]:", err);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 },
    );
  }
}
