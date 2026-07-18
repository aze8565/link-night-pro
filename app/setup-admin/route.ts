import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OWNER_EMAIL = "lkaze2441@gmail.com";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/setup-admin", url.origin));
  }

  if (user.email?.toLowerCase() !== OWNER_EMAIL) {
    return NextResponse.redirect(
      new URL("/account?error=admin_setup_not_allowed", url.origin),
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin", plan: "global" })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.redirect(
      new URL(`/account?error=${encodeURIComponent(profileError.message)}`, url.origin),
    );
  }

  const { error: membershipError } = await supabase.from("memberships").upsert(
    {
      user_id: user.id,
      plan: "global",
      status: "active",
    },
    { onConflict: "user_id" },
  );

  if (membershipError) {
    return NextResponse.redirect(
      new URL(`/account?error=${encodeURIComponent(membershipError.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL("/account?admin=ready", url.origin));
}
