import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function accessLabel(article: Article) {
  if (article.access_level === "free") return "免费公开";
  if (article.access_level === "regional") return "区域会员";
  return "全站会员";
}

export function GuideCard({ article }: { article: Article }) {
  const isVideo = (article.content_type ?? "article") === "video";

  return (
    <article className="card guide-card">
      <Link href={`/guides/${article.slug}`} aria-label={`查看${article.title}`}>
        <div
          className="cover"
          style={
            article.cover_url
              ? { backgroundImage: `url(${article.cover_url})` }
              : undefined
          }
        >
          {isVideo && <span className="play-badge">▶</span>}
          {isVideo && article.duration_text && (
            <span className="duration-badge">{article.duration_text}</span>
          )}
        </div>
        <div className="guide-body">
          <div className="card-labels">
            <span
              className={`pill ${
                article.access_level === "free" ? "pill-free" : "pill-member"
              }`}
            >
              {accessLabel(article)}
            </span>
            <span className="pill pill-plain">{isVideo ? "视频" : "图文"}</span>
          </div>
          <h3>{article.title}</h3>
          <p className="muted">{article.excerpt}</p>
          <div className="meta">
            <span>{article.country} · {article.city}</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="card-read-more">
            <span>{article.access_level === "free" ? "直接查看完整内容" : "先看介绍与预览"}</span>
            <span>→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
