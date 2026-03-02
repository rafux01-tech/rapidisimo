import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { usuario, password } = body;

  // Credenciales desde variables de entorno (o defaults para desarrollo)
  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rapidisimo2024";

  if (usuario === ADMIN_USER && password === ADMIN_PASSWORD) {
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
