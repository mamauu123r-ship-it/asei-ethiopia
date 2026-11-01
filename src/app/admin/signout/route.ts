import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

// Signs out accounts that are logged in but are not ASEI administrators.
export async function GET(request: NextRequest) {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  const reason = request.nextUrl.searchParams.get("reason") === "not-staff" ? "?error=not-staff" : "";
  return NextResponse.redirect(new URL(`/admin/login${reason}`, request.url));
}
