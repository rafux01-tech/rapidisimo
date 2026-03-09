import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  return NextResponse.json({
    authenticated: session?.value === "authenticated",
  });
}
