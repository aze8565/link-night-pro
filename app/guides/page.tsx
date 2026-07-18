import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide-card";
import { POPULAR_DESTINATIONS } from "@/lib/constants";
import type { Article } from "@/lib/types";

const ACCESS_FILTERS = [
  { value: "", label: "全部内容" },
  { value: "free", label: "免费公开" },
  { value: "regional", label: "区域会员" },
  { value: "global", label: "全站会员" },
] as const;

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{
    country?: string;
    city?: string;
    access?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const keyword = (params.q ?? "").trim().toLowerCase();
  const allowedAccess = ["free", "regional", "global"].includes(
    params.access ?? "",
  )
    ? params.access
    : undefined;

  const articles = ((data ?? []) as Article[])
    .filter((item) => (item.content_type ?? "article") === "article")
    .filter((item) => !params.country || item.country === params.country)
    .filter((item) => !params.city || item.city === params.city)
    .filter((item) => !allowedAccess || item.access_level === allowedAccess)
    .filter((item) => {
      if (!keyword) return true;
      return [item.title, item.excerpt, item.country, item.city]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    })
    .sort((a, b) => Number(b.is_featured ?? false) - Number(a.is_featured ?? false));

  const [featured, ...rest] = articles;
  const freeCount = articles.filter((item) => item.access_level === "free").length;
  const memberCount = articles.length - freeCount;

  const filterHref = (patch: Record<string, string | undefined>) => {
    const values = {
      country: params.country,
      city: params.city,
      access: params.access,
      q: params.q,
      ...patch,
    };
    const query = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const suffix = query.toString();
    return suffix ? `/guides?${suffix}` : "/guides";
  };

  return (
    <main className="library-page">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">DESTINATION INTELLIGENCE</p>
            <h1>
              不用登录，先把城市<span>看明白。</span>
            </h1>
            <p className="page-hero-copy">
              从国家、城市、预算和适合人群开始筛选。免费攻略直接看完整内容，会员攻略也会先展示标题、摘要和免费预览，让客户确认有价值以后再购买。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#guide-library">
                开始筛选攻略
              </a>
              <Link className="btn" href="/videos">
                切换视频攻略
              </Link>
            </div>
          </div>
          <div className="hero-proof-grid">
            <div className="hero-proof">
              <strong>{articles.length} 篇当前结果</strong>
              <span>筛选后即时展示，不需要注册账户</span>
            </div>
            <div className="hero-proof">
              <strong>{freeCount} 篇免费公开</strong>
              <span>点进去即可阅读全文</span>
            </div>
            <div className="hero-proof">
              <strong>{memberCount} 篇深度内容</strong>
              <span>先看预览，再决定是否开通</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section content-library" id="guide-library">
        <div className="container">
          <div className="filter-shell">
            <form className="search-form" method="get" action="/guides">
              {params.country && (
                <input type="hidden" name="country" value={params.country} />
              )}
              {params.access && (
                <input type="hidden" name="access" value={params.access} />
              )}
              <input
                className="input"
                name="q"
                type="search"
                defaultValue={params.q ?? ""}
                placeholder="搜索国家、城市或攻略关键词"
              />
              <button className="btn btn-primary" type="submit">
                搜索攻略
              </button>
            </form>

            <div className="filter-group">
              <span className="filter-label">热门国家</span>
              <Link
                href={filterHref({ country: undefined, city: undefined })}
                className={`filter-chip ${!params.country ? "active" : ""}`}
              >
                全部
              </Link>
              {POPULAR_DESTINATIONS.map((destination) => (
                <Link
                  key={destination.country}
                  href={filterHref({
                    country: destination.country,
                    city: undefined,
                  })}
                  className={`filter-chip ${
                    params.country === destination.country ? "active" : ""
                  }`}
                >
                  {destination.country}
                </Link>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">内容权限</span>
              {ACCESS_FILTERS.map((filter) => (
                <Link
                  key={filter.label}
                  href={filterHref({ access: filter.value || undefined })}
                  className={`filter-chip ${
                    (params.access ?? "") === filter.value ? "active" : ""
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
              {(params.country || params.city || params.access || params.q) && (
                <Link href="/guides" className="filter-chip">
                  清除筛选
                </Link>
              )}
            </div>
          </div>

          <div className="library-summary">
            <div>
              <p className="eyebrow">CURATED GUIDES</p>
              <h2>
                {params.country ? `${params.country}攻略` : "全部图文攻略"}
              </h2>
            </div>
            <p>共找到 {articles.length} 篇内容</p>
          </div>

          {featured ? (
            <>
              <article className="card library-feature">
                <Link href={`/guides/${featured.slug}`}>
                  <div
                    className="library-feature-cover"
                    style={
                      featured.cover_url
                        ? { backgroundImage: `url(${featured.cover_url})` }
                        : undefined
                    }
                  />
                  <div className="library-feature-body">
                    <div className="card-labels">
                      <span
                        className={`pill ${
                          featured.access_level === "free"
                            ? "pill-free"
                            : "pill-member"
                        }`}
                      >
                        {featured.access_level === "free"
                          ? "免费公开"
                          : featured.access_level === "regional"
                            ? "区域会员"
                            : "全站会员"}
                      </span>
                      <span className="pill pill-plain">
                        {featured.country} · {featured.city}
                      </span>
                    </div>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <span className="library-feature-action">
                      {featured.access_level === "free"
                        ? "直接阅读完整攻略 →"
                        : "先查看免费预览 →"}
                    </span>
                  </div>
                </Link>
              </article>

              {rest.length > 0 && (
                <div className="grid grid-3">
                  {rest.map((article) => (
                    <GuideCard article={article} key={article.id} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card empty">
              没有找到符合条件的攻略，可以清除筛选后重新查看。
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
