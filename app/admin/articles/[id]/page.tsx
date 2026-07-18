import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleEditor } from "@/components/article-editor";
import type { Article } from "@/lib/types";
export default async function EditArticlePage({params}:{params:Promise<{id:string}>}){const {id}=await params;const {data}=await createAdminClient().from("articles").select("*").eq("id",id).single();if(!data)notFound();return <><div className="admin-head"><div><p className="eyebrow">EDIT ARTICLE</p><h1>编辑文章</h1></div></div><ArticleEditor initial={data as Article}/></>}
