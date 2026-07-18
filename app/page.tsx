import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";

export default async function HomePage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("articles").select("*").eq("status","published").order("published_at",{ascending:false}).limit(6);
  const articles = (data ?? []) as Article[];
  return <main>
    <section className="hero"><div className="container hero-grid">
      <div><p className="eyebrow">GLOBAL NIGHTLIFE DECISION MAP</p><h1>不是告诉你哪里最贵，<br/><span>而是帮你选对这一晚。</span></h1><p>海外热门城市夜生活、合法娱乐与商务接待攻略。预算、区域、最佳时间、安全规则和48小时路线，一次讲清。</p><div className="hero-actions"><Link className="btn btn-primary" href="/guides">开始选城市</Link><Link className="btn" href="/membership">查看会员权益</Link></div></div>
      <aside className="hero-panel"><p className="eyebrow">本站解决什么</p><h2>先看局型，再看预算，最后才看地点。</h2><ul><li>新手第一次去，哪些区域更稳</li><li>单人、情侣、兄弟局、商务接待怎么选</li><li>免费、区域会员、全球会员内容分级</li><li>当地法律、交通和消费确认清单</li></ul></aside>
    </div></section>
    <section className="section"><div className="container"><div className="section-title"><div><p className="eyebrow">LATEST GUIDES</p><h2>最新城市攻略</h2></div><Link href="/guides" className="btn">查看全部</Link></div>{articles.length?<div className="grid grid-3">{articles.map(a=><GuideCard key={a.id} article={a}/>)}</div>:<div className="card empty">完成 Supabase 初始化后，后台发布的文章会出现在这里。</div>}</div></section>
    <section className="section section-alt"><div className="container"><div className="section-title"><div><p className="eyebrow">CONTENT SYSTEM</p><h2>一座城市，固定拆成六个维度</h2></div><p>城市结构、预算分层、适合人群、最佳时间、安全礼仪和24/48小时路线。</p></div><div className="grid grid-3">{["城市夜娱结构","三档预算","适合谁","最佳时间","安全与礼仪","24/48小时路线"].map((x,i)=><div className="card" key={x}><p className="eyebrow">0{i+1}</p><h3>{x}</h3><p className="muted">让用户看完以后能直接做决定，而不是只知道一堆名字。</p></div>)}</div></div></section>
  </main>;
}
