import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getViewer, canAccess } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

async function getArticle(slug:string){const {data}=await createAdminClient().from("articles").select("*").eq("slug",slug).eq("status","published").single();return data as Article|null}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const a=await getArticle(slug);return a?{title:a.title,description:a.excerpt,openGraph:{images:a.cover_url?[a.cover_url]:[]}}:{title:"攻略不存在"}}
export default async function GuideDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=await getArticle(slug);if(!article)notFound();const {profile}=await getViewer();const allowed=canAccess(profile?.plan,article.access_level);return <main className="section"><article className="container prose"><p className="eyebrow">{article.country} · {article.city}</p><h1>{article.title}</h1><div className="meta"><span>{formatDate(article.published_at)}</span><span>{article.access_level==="free"?"免费攻略":"会员攻略"}</span></div>{article.cover_url&&<Image className="article-cover" src={article.cover_url} alt={article.title} width={1200} height={675}/>}<p className="muted">{article.excerpt}</p>{allowed?<Markdown content={article.content}/>:<div className="paywall"><p className="eyebrow">MEMBER CONTENT</p><h2>这篇攻略需要{article.access_level==="regional"?"区域会员":"全球会员"}</h2><p>登录并开通对应会员后，可查看完整正文、预算清单、路线和更新记录。</p><div className="hero-actions"><Link className="btn btn-primary" href="/membership">查看会员</Link><Link className="btn" href={`/login?next=/guides/${article.slug}`}>登录账户</Link></div></div>}</article></main>}
