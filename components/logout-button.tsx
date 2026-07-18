"use client";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  return <button className="btn btn-small" onClick={async()=>{await createClient().auth.signOut();location.href="/"}}>退出</button>;
}
