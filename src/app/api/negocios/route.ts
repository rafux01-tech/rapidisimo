import { NextResponse } from "next/server";
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

// En Vercel (serverless) no podemos escribir archivos persistentes
// Usamos memoria para producción, archivo para desarrollo local
const isVercel = process.env.VERCEL === "1";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "negocios.json");

// Store en memoria para Vercel
let memoriaLeads: NegocioLeadStored[] = [];

async function leerLeads(): Promise<NegocioLeadStored[]> {
  if (isVercel) {
    return memoriaLeads;
  }
  
  // Desarrollo local: leer del archivo
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

async function escribirLeads(leads: NegocioLeadStored[]) {
  if (isVercel) {
    memoriaLeads = leads;
    return;
  }
  
  // Desarrollo local: escribir al archivo
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function GET() {
  const leads = await leerLeads();
  const sorted = [...leads].sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
  );
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
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

  const actualizados = [...existentes, nuevo];
  await escribirLeads(actualizados);

  return NextResponse.json(nuevo, { status: 201 });
}


