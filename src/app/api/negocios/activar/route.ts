import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Endpoint para activar un negocio desde un lead (solo admin)
export async function POST(request: Request) {
  // Verificar autenticación admin
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { leadId, email, password } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId es requerido" },
        { status: 400 },
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos para activar el negocio" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Obtener el lead
    const { data: lead, error: leadError } = await supabase
      .from("negocios_leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 },
      );
    }

    // Verificar que el email no esté en uso
    const { data: emailExistente } = await supabase
      .from("negocios")
      .select("id")
      .eq("email", email)
      .single();

    if (emailExistente) {
      return NextResponse.json(
        { error: "Este email ya está en uso por otro negocio" },
        { status: 400 },
      );
    }

    // Hashear la contraseña antes de guardarla
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear el negocio activo
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .insert({
        nombre_negocio: lead.nombre_negocio,
        contacto_nombre: lead.contacto_nombre,
        contacto_telefono: lead.contacto_telefono,
        direccion: lead.direccion,
        sector: lead.direccion.split(",")[0] || null, // Extraer sector de dirección
        tipo_negocio: lead.tipo_negocio,
        horario: lead.horario || null,
        email: email,
        password_hash: passwordHash, // Contraseña hasheada con bcrypt
        activo: true,
      })
      .select()
      .single();

    if (negocioError) {
      console.error("Error creando negocio:", negocioError);
      return NextResponse.json(
        { error: "Error al activar negocio" },
        { status: 500 },
      );
    }

    // Actualizar el estado del lead a "activado"
    await supabase
      .from("negocios_leads")
      .update({ estado: "activado" })
      .eq("id", leadId);

    return NextResponse.json(negocio, { status: 201 });
  } catch (err) {
    console.error("Error en POST /api/negocios/activar:", err);
    return NextResponse.json(
      { error: "Error al activar negocio" },
      { status: 500 },
    );
  }
}
