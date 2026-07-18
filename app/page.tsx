import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";
import styles from "./home.module.css";

const countries = [
  {
    name: "泰国",
    english: "THAILAND",
    cities: "曼谷 · 芭提雅 · 普吉岛 · 清迈",
    description: "第一次出发最容易看懂，也最容易因为信息差踩坑。",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=88",
  },
  {
    name: "日本",
    english: "JAPAN",
    cities: "东京 · 大阪 · 福冈 · 札幌",
    description: "规则、预算和区域差异，比单纯找热门地点更重要。",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=88",
  },
  {
    name: "韩国",
    english: "KOREA",
    cities: "首尔 · 釜山 · 济州",
    description: "适合看重氛围、审美和城市夜间体验的人。",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=86",
  },
  {
    name: "越南",
    english: "VIETNAM",
    cities: "胡志明市 · 河内 · 岘港 · 芽庄",
    description: "不同城市的消费逻辑完全不同，不能照搬一套玩法。",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=86",
  },
  {
    name: "菲律宾",
    english: "PHILIPPINES",
    cities: "马尼拉 · 宿务",
    description: "先看区域和安全，再决定这一晚怎么安排。",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=86",
  },
  {
    name: "印度尼西亚",
    english: "INDONESIA",
    cities: "巴厘岛 · 雅加达",
    description: "度假、社交和夜间娱乐，适合用不同路线拆开看。",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=86",
  },
  {
    name: "马来西亚",
    english: "MALAYSIA",
    cities: "吉隆坡",
    description: "看懂区域、交通和营业节奏，体验会稳定很多。",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=86",
  },
  {
    name: "新加坡",
    english: "SINGAPORE",
    cities: "新加坡",
    description: "预算更高、规则更清楚，更适合提前做消费判断。",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=86",
  },
];

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
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(3,5,8,.96) 0%, rgba(3,5,8,.82) 38%, rgba(3,5,8,.28) 72%, rgba(3,5,8,.72) 100%), linear-gradient(0deg, #07090d 0%, transparent 38%), url(https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=92)",
        }}
      >
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>GLOBAL NIGHTLIFE GUIDE · 霖K</p>
            <h1>
              一张地图，
              <br />
              带你看懂<span>海外夜生活。</span>
            </h1>
            <p className={styles.heroLead}>
              不做模糊推荐，也不把所有人拦在登录页外面。先免费看城市、预算和玩法，真正需要深度路线时，再选择付费内容。
            </p>
            <div className={styles.heroActions}>
              <Link href="#countries" className="btn btn-primary">
                选择国家
              </Link>
              <Link href="/videos" className={`btn ${styles.glassButton}`}>
                先看免费视频
              </Link>
            </div>
            <div className={styles.heroFacts}>
              <div><strong>无需登录</strong><span>免费内容直接浏览</span></div>
              <div><strong>清楚标价</strong><span>免费与付费明确区分</span></div>
              <div><strong>按需购买</strong><span>需要深度内容再买单</span></div>
            </div>
          </div>

          <div className={styles.heroSide}>
            <span className={styles.sideIndex}>01</span>
            <p>不是告诉你哪里最贵</p>
            <h2>而是帮你判断，今晚的钱该花在哪里。</h2>
            <Link href="/guides" className={styles.arrowLink}>浏览全部内容 →</Link>
          </div>
        </div>
      </section>

      <section className={styles.introStrip}>
        <div className={`container ${styles.introGrid}`}>
          <div><span>01</span><strong>国家入口</strong><p>先选国家，再看城市和玩法。</p></div>
          <div><span>02</span><strong>免费视频</strong><p>不登录也能直接观看。</p></div>
          <div><span>03</span><strong>深度攻略</strong><p>预算、区域、流程一次讲清。</p></div>
          <div><span>04</span><strong>会员内容</strong><p>确认有价值以后再购买。</p></div>
        </div>
      </section>

      <section id="countries" className={styles.countriesSection}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>EXPLORE BY COUNTRY</p>
              <h2>先选国家，再决定这一晚怎么玩</h2>
            </div>
            <p>每个国家的消费结构、区域差异和适合人群都不一样。不要拿一座城市的经验，去套另一座城市。</p>
          </div>

          <div className={styles.countryGrid}>
            {countries.map((country, index) => (
              <Link
                key={country.name}
                href={`/guides?country=${encodeURIComponent(country.name)}`}
                className={`${styles.countryCard} ${index < 2 ? styles.countryCardLarge : ""}`}
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(3,5,8,.92) 0%, rgba(3,5,8,.08) 72%), url(${country.image})`,
                }}
              >
                <div className={styles.countryTop}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{country.english}</b>
                </div>
                <div className={styles.countryBottom}>
                  <h3>{country.name}</h3>
                  <p className={styles.cityNames}>{country.cities}</p>
                  <p>{country.description}</p>
                  <strong>进入国家攻略 →</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>LATEST VIDEO</p>
              <h2>先用视频，快速看懂一个城市</h2>
            </div>
            <Link href="/videos" className={styles.arrowLink}>查看全部视频 →</Link>
          </div>
          {videos.length ? (
            <div className="grid grid-3">
              {videos.map((video) => <GuideCard key={video.id} article={video} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>VIDEO</span>
              <h3>视频内容区已经准备好</h3>
              <p>你在后台选择“视频攻略”并发布后，内容会自动出现在这里。</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.lightDarkSection}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>CITY GUIDES</p>
              <h2>看完介绍，再决定要不要付费</h2>
            </div>
            <p>免费攻略直接阅读全文；付费攻略也会先展示封面、摘要和试看部分，不会让客户盲买。</p>
          </div>
          {articles.length ? (
            <div className="grid grid-3">
              {articles.map((article) => <GuideCard key={article.id} article={article} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>GUIDES</span>
              <h3>图文内容区已经准备好</h3>
              <p>发布第一篇攻略后，首页会自动生成内容卡片。</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`container ${styles.finalCtaInner}`}>
          <div>
            <p className={styles.kicker}>FREE FIRST · PAY WHEN NEEDED</p>
            <h2>先让客户看到价值，<br />再让客户决定买不买。</h2>
          </div>
          <div>
            <p>免费内容负责建立信任，深度内容负责解决决策。登录不再是入口，而是购买和管理内容时才需要的动作。</p>
            <div className={styles.heroActions}>
              <Link href="/guides" className="btn btn-primary">开始浏览</Link>
              <Link href="/membership" className="btn">查看付费内容</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
