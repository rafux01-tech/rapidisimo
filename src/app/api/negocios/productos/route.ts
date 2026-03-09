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

  // Verificar que el negocio existe y está activo
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

// GET: Obtener productos de un negocio
export async function GET(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json([]);
  }

  try {
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
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("negocio_id", negocioId)
      .order("categoria", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error obteniendo productos:", error);
      return NextResponse.json(
        { error: "Error al cargar productos" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Error en GET /api/negocios/productos:", err);
    return NextResponse.json(
      { error: "Error al cargar productos" },
      { status: 500 },
    );
  }
}

// POST: Crear nuevo producto
export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { negocioId, nombre, precio, categoria, descripcion, imagen_url, categoria_en, nombre_en } = body;

    if (!negocioId || !nombre || !precio || !categoria) {
      return NextResponse.json(
        { error: "negocioId, nombre, precio y categoria son requeridos" },
        { status: 400 },
      );
    }

    // Verificar autenticación
    const autenticado = await verificarNegocioAuth(negocioId);
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("productos")
      .insert({
        negocio_id: negocioId,
        nombre,
        nombre_en: nombre_en || null,
        precio: Number(precio),
        categoria,
        categoria_en: categoria_en || null,
        descripcion: descripcion || null,
        imagen_url: imagen_url || null,
        disponible: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando producto:", error);
      return NextResponse.json(
        { error: "Error al crear producto" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Error en POST /api/negocios/productos:", err);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 },
    );
  }
}
