import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer, canAccess } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import { VideoPlayer } from "@/components/video-player";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Article | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return article
    ? {
        title: article.title,
        description: article.excerpt,
        openGraph: { images: article.cover_url ? [article.cover_url] : [] },
      }
    : { title: "内容不存在" };
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { user, profile } = await getViewer();
  const allowed = canAccess(profile?.plan, article.access_level);
  const isVideo = (article.content_type ?? "article") === "video";
  const accessName =
    article.access_level === "regional" ? "区域会员" : "全站会员";

  return (
    <main className="section">
      <article className="container prose">
        <div className="content-title-row">
          <div>
            <p className="eyebrow">
              {isVideo ? "VIDEO GUIDE" : "ARTICLE GUIDE"} · {article.country} · {article.city}
            </p>
            <h1>{article.title}</h1>
          </div>
          <span className={`pill ${article.access_level === "free" ? "pill-free" : "pill-member"}`}>
            {article.access_level === "free" ? "免费公开" : accessName}
          </span>
        </div>

        <div className="meta">
          <span>{formatDate(article.published_at)}</span>
          <span>{isVideo ? "视频攻略" : "图文攻略"}</span>
          {article.duration_text && <span>{article.duration_text}</span>}
        </div>

        {article.cover_url && (!isVideo || !allowed) && (
          <Image
            className="article-cover"
            src={article.cover_url}
            alt={article.title}
            width={1200}
            height={675}
          />
        )}

        <p className="article-lead">{article.excerpt}</p>

        {article.preview_content && (
          <section className="preview-block">
            <p className="eyebrow">FREE PREVIEW</p>
            <Markdown content={article.preview_content} />
          </section>
        )}

        {allowed ? (
          <>
            {isVideo && article.video_url && (
              <VideoPlayer url={article.video_url} title={article.title} />
            )}
            <Markdown content={article.content} />
          </>
        ) : (
          <div className="paywall">
            <p className="eyebrow">PAID CONTENT</p>
            <h2>完整内容属于{accessName}</h2>
            <p>
              你可以继续浏览全站的免费内容。只有在决定查看这篇完整攻略时，才需要登录并选择对应方案。
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/membership">
                查看购买方案
              </Link>
              {!user && (
                <Link
                  className="btn"
                  href={`/login?next=/guides/${article.slug}`}
                >
                  已购买？登录查看
                </Link>
              )}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
