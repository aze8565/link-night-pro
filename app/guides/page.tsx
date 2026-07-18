import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; city?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (params.country) query = query.eq("country", params.country);
  if (params.city) query = query.eq("city", params.city);

  const { data } = await query;
  const articles = ((data ?? []) as Article[]).filter(
    (item) => (item.content_type ?? "article") === "article",
  );

  return (
    <main className="section content-library">
      <div className="container">
        <div className="library-heading">
          <div>
            <p className="eyebrow">ARTICLE GUIDES</p>
            <h1>图文攻略</h1>
            <p className="muted">
              所有访客都能浏览目录和内容介绍。免费攻略直接阅读全文，会员攻略先看预览，再决定是否购买。
            </p>
          </div>
          <a className="btn" href="/videos">切换到视频攻略</a>
        </div>

        {articles.length ? (
          <div className="grid grid-3">
            {articles.map((article) => (
              <GuideCard article={article} key={article.id} />
            ))}
          </div>
        ) : (
          <div className="card empty">还没有发布图文攻略。</div>
        )}
      </div>
    </main>
  );
}
