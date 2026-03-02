import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { promises as fs } from "fs";
import path from "path";

type LeadEstado = "nuevo" | "contactado" | "activado";

export interface NegocioLeadPayload {
  nombreNegocio: string;
  contactoNombre: string;
  contactoTelefono: string;
  direccion: string;
  tipoNegocio: string;
  horario?: string;
}

export interface NegocioLeadStored extends NegocioLeadPayload {
  id: string;
  estado: LeadEstado;
  creadoEn: string;
}

// Verificar si Supabase está configurado
const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback: archivo local para desarrollo si no hay Supabase
const isVercel = process.env.VERCEL === "1";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "negocios.json");

// Store en memoria como último recurso
let memoriaLeads: NegocioLeadStored[] = [];

// Leer desde Supabase
async function leerLeadsSupabase(): Promise<NegocioLeadStored[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("negocios_leads")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      console.error("Error leyendo de Supabase:", error);
      return [];
    }

    // Convertir formato de DB a formato de la app
    return (data || []).map((row) => ({
      id: row.id,
      nombreNegocio: row.nombre_negocio,
      contactoNombre: row.contacto_nombre,
      contactoTelefono: row.contacto_telefono,
      direccion: row.direccion,
      tipoNegocio: row.tipo_negocio,
      horario: row.horario || "",
      estado: row.estado as LeadEstado,
      creadoEn: row.creado_en,
    }));
  } catch (err) {
    console.error("Error en leerLeadsSupabase:", err);
    return [];
  }
}

// Leer desde archivo local (fallback)
async function leerLeadsArchivo(): Promise<NegocioLeadStored[]> {
  try {
    const contenido = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(contenido) as NegocioLeadStored[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === "ENOENT") {
      return [];
    }
    console.error("Error leyendo negocios.json", err);
    return [];
  }
}

async function leerLeads(): Promise<NegocioLeadStored[]> {
  if (tieneSupabase) {
    return leerLeadsSupabase();
  }

  if (isVercel) {
    return memoriaLeads;
  }

  return leerLeadsArchivo();
}

// Escribir a Supabase
async function escribirLeadSupabase(
  lead: Omit<NegocioLeadStored, "id" | "creadoEn">,
): Promise<NegocioLeadStored> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("negocios_leads")
    .insert({
      nombre_negocio: lead.nombreNegocio,
      contacto_nombre: lead.contactoNombre,
      contacto_telefono: lead.contactoTelefono,
      direccion: lead.direccion,
      tipo_negocio: lead.tipoNegocio,
      horario: lead.horario || null,
      estado: lead.estado,
    })
    .select()
    .single();

  if (error) {
    console.error("Error escribiendo a Supabase:", error);
    throw error;
  }

  return {
    id: data.id,
    nombreNegocio: data.nombre_negocio,
    contactoNombre: data.contacto_nombre,
    contactoTelefono: data.contacto_telefono,
    direccion: data.direccion,
    tipoNegocio: data.tipo_negocio,
    horario: data.horario || "",
    estado: data.estado as LeadEstado,
    creadoEn: data.creado_en,
  };
}

// Escribir a archivo local (fallback)
async function escribirLeadsArchivo(leads: NegocioLeadStored[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function GET() {
  try {
    const leads = await leerLeads();
    // Si viene de Supabase ya está ordenado, pero por si acaso:
    const sorted = [...leads].sort(
      (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error en GET /api/negocios:", error);
    return NextResponse.json(
      { error: "Error al cargar los leads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NegocioLeadPayload>;

    if (
      !body.nombreNegocio ||
      !body.contactoNombre ||
      !body.contactoTelefono ||
      !body.direccion ||
      !body.tipoNegocio
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    // Si tenemos Supabase, usar eso
    if (tieneSupabase) {
      try {
        const nuevo = await escribirLeadSupabase({
          nombreNegocio: body.nombreNegocio,
          contactoNombre: body.contactoNombre,
          contactoTelefono: body.contactoTelefono,
          direccion: body.direccion,
          tipoNegocio: body.tipoNegocio,
          horario: body.horario ?? "",
          estado: "nuevo",
        });
        return NextResponse.json(nuevo, { status: 201 });
      } catch (supabaseError: any) {
        console.error("Error de Supabase:", supabaseError);
        return NextResponse.json(
          {
            error: "Error al guardar en Supabase",
            detalles: supabaseError?.message || "Error desconocido",
          },
          { status: 500 },
        );
      }
    }

    // Fallback: usar archivo o memoria
    const existentes = await leerLeads();
    const siguienteNumero = existentes.length + 1;

    const nuevo: NegocioLeadStored = {
      id: `NEG-${siguienteNumero.toString().padStart(4, "0")}`,
      nombreNegocio: body.nombreNegocio,
      contactoNombre: body.contactoNombre,
      contactoTelefono: body.contactoTelefono,
      direccion: body.direccion,
      tipoNegocio: body.tipoNegocio,
      horario: body.horario ?? "",
      estado: "nuevo",
      creadoEn: new Date().toISOString(),
    };

    if (isVercel) {
      memoriaLeads = [...existentes, nuevo];
    } else {
      const actualizados = [...existentes, nuevo];
      await escribirLeadsArchivo(actualizados);
    }

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/negocios:", error);
    return NextResponse.json(
      { error: "Error al guardar el lead" },
      { status: 500 },
    );
  }
}


