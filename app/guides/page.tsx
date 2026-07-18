import { createAdminClient } from "@/lib/supabase/admin";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ country?: string; city?: string }> }) {
  const params = await searchParams;
  const supabase = createAdminClient();
  let query = supabase.from("articles").select("*").eq("status","published").order("published_at",{ascending:false});
  if(params.country) query=query.eq("country",params.country);
  if(params.city) query=query.eq("city",params.city);
  const {data}=await query;
  const articles=(data??[]) as Article[];
  return <main className="section"><div className="container"><div className="section-title"><div><p className="eyebrow">DESTINATION GUIDES</p><h2>海外城市攻略</h2></div><p>免费内容用于建立基本判断，会员内容提供完整路线、预算表和持续更新。</p></div>{articles.length?<div className="grid grid-3">{articles.map(a=><GuideCard article={a} key={a.id}/>)}</div>:<div className="card empty">还没有符合条件的攻略。</div>}</div></main>;
}
