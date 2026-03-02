import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ClientePayload {
  nombre: string;
  telefono: string;
  direccion?: string;
  email?: string;
}

export interface ClienteStored extends ClientePayload {
  id: string;
  creadoEn: string;
}

export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as Partial<ClientePayload>;

    if (!body.nombre || !body.telefono) {
      return NextResponse.json(
        { error: "Nombre y teléfono son obligatorios" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombre: body.nombre,
        telefono: body.telefono,
        direccion: body.direccion || null,
        email: body.email || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando cliente:", error);
      return NextResponse.json(
        { error: "Error al registrar cliente" },
        { status: 500 },
      );
    }

    const cliente: ClienteStored = {
      id: data.id,
      nombre: data.nombre,
      telefono: data.telefono,
      direccion: data.direccion || undefined,
      email: data.email || undefined,
      creadoEn: data.creado_en,
    };

    return NextResponse.json(cliente, { status: 201 });
  } catch (err) {
    console.error("Error en POST /api/clientes:", err);
    return NextResponse.json(
      { error: "Error al registrar cliente" },
      { status: 500 },
    );
  }
}
