import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(18);

  const content = (data ?? []) as Article[];
  const videos = content
    .filter((item) => (item.content_type ?? "article") === "video")
    .slice(0, 6);
  const articles = content
    .filter((item) => (item.content_type ?? "article") === "article")
    .slice(0, 6);

  return (
    <main>
      <section className="portal-hero">
        <div className="container portal-hero-grid">
          <div>
            <p className="eyebrow">霖K · 海外夜娱内容库</p>
            <h1>
              先免费了解，
              <br />
              <span>觉得有用再付费。</span>
            </h1>
            <p className="portal-lead">
              图文攻略和视频目录全部开放浏览。免费内容不登录也能直接看；需要完整路线、预算和持续更新的内容，再按需购买会员。
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/videos">
                先看免费视频
              </Link>
              <Link className="btn" href="/guides">
                浏览全部攻略
              </Link>
            </div>
            <div className="trust-row">
              <span>✓ 浏览无需登录</span>
              <span>✓ 免费与会员内容清楚标注</span>
              <span>✓ 登录只在购买或查看已购内容时需要</span>
            </div>
          </div>

          <aside className="portal-menu card">
            <p className="eyebrow">从这里开始</p>
            <Link href="/videos" className="portal-menu-item">
              <span>01</span>
              <div>
                <strong>视频攻略</strong>
                <small>先用视频快速了解城市和玩法</small>
              </div>
              <b>→</b>
            </Link>
            <Link href="/guides" className="portal-menu-item">
              <span>02</span>
              <div>
                <strong>图文攻略</strong>
                <small>查看预算、区域、流程和注意事项</small>
              </div>
              <b>→</b>
            </Link>
            <Link href="/membership" className="portal-menu-item">
              <span>03</span>
              <div>
                <strong>会员内容</strong>
                <small>需要深度内容时再选择购买</small>
              </div>
              <b>→</b>
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">VIDEO GUIDES</p>
              <h2>最新视频攻略</h2>
              <p className="muted">免费内容直接播放，会员内容也能先看标题、封面和介绍。</p>
            </div>
            <Link href="/videos" className="btn">全部视频</Link>
          </div>
          {videos.length ? (
            <div className="grid grid-3">
              {videos.map((video) => (
                <GuideCard key={video.id} article={video} />
              ))}
            </div>
          ) : (
            <div className="card empty">
              你还没有发布视频。后台升级完成后，选择“视频攻略”即可发布到这里。
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">ARTICLE GUIDES</p>
              <h2>最新图文攻略</h2>
              <p className="muted">所有内容都可以先浏览介绍，免费文章无需注册即可阅读全文。</p>
            </div>
            <Link href="/guides" className="btn">全部图文</Link>
          </div>
          {articles.length ? (
            <div className="grid grid-3">
              {articles.map((article) => (
                <GuideCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="card empty">后台发布的图文攻略会展示在这里。</div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">HOW IT WORKS</p>
              <h2>内容怎么收费，一眼就能看懂</h2>
            </div>
            <p>不是先把用户挡在登录页外面，而是先让用户看见价值，再决定要不要付费。</p>
          </div>
          <div className="grid grid-3">
            <div className="card model-card">
              <span className="model-icon">免</span>
              <h3>免费公开</h3>
              <p className="muted">任何人都能直接阅读或播放，不需要注册账户。</p>
              <Link href="/guides" className="text-link">查看免费内容 →</Link>
            </div>
            <div className="card model-card">
              <span className="model-icon">区</span>
              <h3>区域会员</h3>
              <p className="muted">适合只关注某一地区的用户，按需求购买，不必买全站。</p>
              <Link href="/membership" className="text-link">查看区域方案 →</Link>
            </div>
            <div className="card model-card">
              <span className="model-icon">全</span>
              <h3>全站会员</h3>
              <p className="muted">解锁全部国家和后续新增内容，适合长期关注的用户。</p>
              <Link href="/membership" className="text-link">查看全站方案 →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
