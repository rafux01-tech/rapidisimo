import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");

  return NextResponse.json({ success: true });
}
