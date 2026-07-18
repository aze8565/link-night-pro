import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";const fixed=["","/guides","/membership","/privacy","/terms","/refund"].map(url=>({url:base+url,lastModified:new Date()}));try{const {data}=await createAdminClient().from("articles").select("slug,updated_at").eq("status","published");return [...fixed,...(data??[]).map(x=>({url:`${base}/guides/${x.slug}`,lastModified:new Date(x.updated_at)}))]}catch{return fixed}}
