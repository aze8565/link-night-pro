import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function GuideCard({ article }: { article: Article }) {
  return (
    <article className="card guide-card">
      <Link href={`/guides/${article.slug}`}>
        <div className="cover" style={article.cover_url ? { backgroundImage: `url(${article.cover_url})` } : undefined} />
        <div className="guide-body">
          <span className="pill">{article.access_level === "free" ? "免费" : article.access_level === "regional" ? "区域会员" : "全球会员"}</span>
          <h3>{article.title}</h3>
          <p className="muted">{article.excerpt}</p>
          <div className="meta"><span>{article.country} · {article.city}</span><span>{formatDate(article.published_at)}</span></div>
        </div>
      </Link>
    </article>
  );
}
