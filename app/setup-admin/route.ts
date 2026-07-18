import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.redirect(
      new URL("/account?error=profile_not_found", url.origin),
    );
  }

  if (profile.role !== "admin") {
    const { error: updateProfileError } = await admin
      .from("profiles")
      .update({ role: "admin", plan: "global" })
      .eq("id", user.id);

    if (updateProfileError) {
      return NextResponse.redirect(
        new URL("/account?error=admin_setup_failed", url.origin),
      );
    }
  }

  const { error: membershipError } = await admin.from("memberships").upsert(
    {
      user_id: user.id,
      plan: "global",
      status: "active",
    },
    { onConflict: "user_id" },
  );

  if (membershipError) {
    return NextResponse.redirect(
      new URL("/account?error=membership_setup_failed", url.origin),
    );
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}
