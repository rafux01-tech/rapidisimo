import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { negocioId } = body;

    if (negocioId) {
      const cookieStore = await cookies();
      cookieStore.delete(`negocio_session_${negocioId}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true }); // Siempre retornar éxito
  }
}
