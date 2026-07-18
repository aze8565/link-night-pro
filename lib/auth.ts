import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Plan } from "@/lib/types";
import { PLAN_RANK } from "@/lib/constants";

export async function getViewer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { user, profile };
}

export async function requireUser() {
  const viewer = await getViewer();
  if (!viewer.user) redirect("/login");
  return viewer;
}

export async function requireEditor() {
  const viewer = await requireUser();
  if (!viewer.profile || !["editor", "admin"].includes(viewer.profile.role)) {
    redirect("/account?error=no_permission");
  }
  return viewer;
}

export function canAccess(plan: Plan | undefined, required: Plan) {
  return PLAN_RANK[plan ?? "free"] >= PLAN_RANK[required];
}
