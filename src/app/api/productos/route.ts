import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ProductoAPI {
  id: string;
  nombre: string;
  nombreEn?: string;
  precio: number;
  categoria: string;
  categoriaEn?: string;
  imagen?: string;
  negocioId: string;
  negocioNombre?: string;
}

export async function GET() {
  if (!tieneSupabase) {
    return NextResponse.json([]);
  }

  try {
    const supabase = getSupabaseClient();
    
    // Obtener productos de negocios activos
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id,
        nombre,
        nombre_en,
        precio,
        categoria,
        categoria_en,
        imagen_url,
        disponible,
        negocio_id,
        negocios:negocio_id (
          nombre_negocio,
          activo
        )
      `)
      .eq("disponible", true)
      .order("categoria", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error obteniendo productos:", error);
      return NextResponse.json(
        { error: "Error al cargar productos" },
        { status: 500 },
      );
    }

    // Filtrar solo productos de negocios activos y transformar formato
    const productos = (data || [])
      .filter((p: any) => p.negocios?.activo === true)
      .map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        nombreEn: p.nombre_en || undefined,
        precio: Number(p.precio),
        categoria: p.categoria,
        categoriaEn: p.categoria_en || undefined,
        imagen: p.imagen_url || undefined,
        negocioId: p.negocio_id,
        negocioNombre: p.negocios?.nombre_negocio,
      }));

    return NextResponse.json(productos);
  } catch (err) {
    console.error("Error en GET /api/productos:", err);
    return NextResponse.json(
      { error: "Error al cargar productos" },
      { status: 500 },
    );
  }
}
