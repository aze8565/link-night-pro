import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer, canAccess } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import { VideoPlayer } from "@/components/video-player";
import { GuideCard } from "@/components/guide-card";
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

  const supabase = await createClient();
  const { data: relatedData } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("country", article.country)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(8);

  const related = ((relatedData ?? []) as Article[])
    .filter(
      (item) =>
        (item.content_type ?? "article") ===
        (article.content_type ?? "article"),
    )
    .slice(0, 3);

  return (
    <main className="detail-page">
      <section className="detail-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="面包屑导航">
            <Link href="/">首页</Link>
            <span>/</span>
            <Link href={isVideo ? "/videos" : "/guides"}>
              {isVideo ? "视频攻略" : "图文攻略"}
            </Link>
            <span>/</span>
            <Link href={`/guides?country=${encodeURIComponent(article.country)}`}>
              {article.country}
            </Link>
            <span>/</span>
            <span>{article.city}</span>
          </nav>

          <div className="detail-hero-grid">
            <div className="detail-title">
              <div className="card-labels">
                <span
                  className={`pill ${
                    article.access_level === "free"
                      ? "pill-free"
                      : "pill-member"
                  }`}
                >
                  {article.access_level === "free" ? "免费公开" : accessName}
                </span>
                <span className="pill pill-plain">
                  {isVideo ? "视频攻略" : "图文攻略"}
                </span>
                <span className="pill pill-plain">
                  {article.country} · {article.city}
                </span>
              </div>
              <h1>{article.title}</h1>
              <p className="article-lead">{article.excerpt}</p>
              <div className="meta">
                <span>更新于 {formatDate(article.published_at)}</span>
                {article.duration_text && <span>{article.duration_text}</span>}
                <span>
                  {article.access_level === "free"
                    ? "无需登录即可查看"
                    : "免费预览后再决定购买"}
                </span>
              </div>
            </div>

            {article.cover_url ? (
              <Image
                className="detail-cover"
                src={article.cover_url}
                alt={article.title}
                width={1200}
                height={825}
                priority
              />
            ) : (
              <div className="detail-cover-placeholder">
                <span>{article.country} · {article.city}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container article-layout">
          <article className="article-main prose">
            {article.preview_content && (
              <section className="preview-block-upgraded">
                <p className="eyebrow">FREE PREVIEW</p>
                <h2>先看这一部分，再决定是否继续</h2>
                <Markdown content={article.preview_content} />
              </section>
            )}

            {allowed ? (
              <>
                {article.preview_content && (
                  <div className="content-divider">完整内容从这里开始</div>
                )}
                {isVideo && article.video_url && (
                  <VideoPlayer url={article.video_url} title={article.title} />
                )}
                <Markdown content={article.content} />
              </>
            ) : (
              <div className="paywall paywall-upgraded">
                <p className="eyebrow">MEMBER CONTENT</p>
                <h2>完整内容属于{accessName}</h2>
                <p>
                  你已经看过标题、摘要和免费预览。确定这篇内容对你有帮助以后，再选择对应会员，不需要为了浏览网站提前注册。
                </p>
                <div className="paywall-benefits">
                  <span>完整预算与消费结构</span>
                  <span>区域选择和适合人群</span>
                  <span>时间、交通和路线安排</span>
                  <span>避坑提醒与持续更新</span>
                </div>
                <div className="hero-actions">
                  <Link className="btn btn-primary" href="/membership">
                    查看会员方案
                  </Link>
                  {!user ? (
                    <Link
                      className="btn"
                      href={`/login?next=/guides/${article.slug}`}
                    >
                      已购买？登录查看
                    </Link>
                  ) : (
                    <Link className="btn" href="/account">
                      查看我的账户
                    </Link>
                  )}
                </div>
              </div>
            )}
          </article>

          <aside className="article-side">
            <div className="card side-card">
              <p className="eyebrow">CONTENT ACCESS</p>
              <h3>
                {article.access_level === "free" ? "这篇可以直接看" : accessName}
              </h3>
              <ul className="side-list">
                <li>内容类型：{isVideo ? "视频攻略" : "图文攻略"}</li>
                <li>目的地：{article.country} · {article.city}</li>
                <li>
                  权限：
                  {article.access_level === "free" ? "免费公开" : accessName}
                </li>
                <li>登录：{allowed ? "当前可以查看" : "购买或查看已购内容时需要"}</li>
              </ul>
              {article.access_level === "free" ? (
                <Link className="btn" href={isVideo ? "/videos" : "/guides"}>
                  浏览更多免费内容
                </Link>
              ) : allowed ? (
                <Link className="btn" href="/account">
                  管理我的会员
                </Link>
              ) : (
                <Link className="btn btn-primary" href="/membership">
                  解锁完整内容
                </Link>
              )}
            </div>

            <div className="card side-card">
              <p className="eyebrow">WHY LIN K</p>
              <h3>先帮你筛掉错误答案</h3>
              <p className="muted">
                内容不是简单罗列名字，而是围绕预算、区域、适合人群、时间和风险，帮助用户做决定。
              </p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt related-section">
          <div className="container">
            <div className="section-title">
              <div>
                <p className="eyebrow">MORE IN {article.country}</p>
                <h2>继续看{article.country}相关内容</h2>
              </div>
              <Link href={`/guides?country=${encodeURIComponent(article.country)}`} className="btn">
                查看该国家全部攻略
              </Link>
            </div>
            <div className="grid grid-3">
              {related.map((item) => (
                <GuideCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
