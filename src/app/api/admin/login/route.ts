import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const { usuario, password } = body;

  // Credenciales desde variables de entorno
  // ⚠️ IMPORTANTE: En producción, SIEMPRE configura ADMIN_USER y ADMIN_PASSWORD en Vercel
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // En desarrollo, permitir defaults solo si no hay variables configuradas
  // En producción, requerir variables de entorno
  const isProduction = process.env.NODE_ENV === "production";
  const user = ADMIN_USER || (isProduction ? null : "admin");
  const pass = ADMIN_PASSWORD || (isProduction ? null : "rapidisimo2024");

  if (!user || !pass) {
    console.error("ADMIN_USER o ADMIN_PASSWORD no configurados");
    return NextResponse.json(
      { error: "Configuración de administrador no disponible" },
      { status: 500 },
    );
  }

  if (usuario === user && password === pass) {
    // Crear cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Credenciales incorrectas" },
    { status: 401 },
  );
}
