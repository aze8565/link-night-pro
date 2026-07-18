import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";

const COMPARISON_ROWS = [
  ["浏览网站和内容目录", "✓", "✓", "✓"],
  ["免费图文和免费视频", "✓", "✓", "✓"],
  ["付费内容免费预览", "✓", "✓", "✓"],
  ["指定区域完整内容", "—", "✓", "✓"],
  ["全部国家和城市内容", "—", "—", "✓"],
  ["后续新增深度内容", "—", "区域范围", "全站范围"],
] as const;

const FAQS = [
  {
    question: "不登录可以浏览网站吗？",
    answer:
      "可以。首页、攻略目录、内容标题、摘要以及标注为免费的完整内容，都不要求登录。只有购买或查看已购内容时才需要账户。",
  },
  {
    question: "会员内容在购买前能看到什么？",
    answer:
      "可以看到封面、标题、目的地、内容介绍和作者设置的免费预览部分。先确认内容是否适合自己，再决定是否开通。",
  },
  {
    question: "区域会员和全站会员怎么选？",
    answer:
      "只关注一个区域或近期只去少数国家，选择区域会员即可；长期关注多个国家和后续新增城市，则更适合全站会员。",
  },
  {
    question: "购买后从哪里查看？",
    answer:
      "支付完成后，会员权限会绑定到购买时登录的账户。以后登录同一个账户，即可查看对应范围的完整内容。",
  },
] as const;

export default function MembershipPage() {
  return (
    <main className="membership-page">
      <section className="page-hero membership-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">MEMBERSHIP ACCESS</p>
            <h1>
              先免费了解，<br />
              <span>确定有用再开通。</span>
            </h1>
            <p className="page-hero-copy">
              浏览网站不需要登录，免费内容直接看，会员内容也可以先看介绍和预览。只有当你确定需要完整预算、路线、区域分析和持续更新时，再选择适合自己的方案。
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="#plans">
                查看会员方案
              </Link>
              <Link className="btn" href="/guides">
                先看免费内容
              </Link>
            </div>
            <div className="membership-trust-row">
              <span>✓ 浏览无需注册</span>
              <span>✓ 免费与会员内容清楚标注</span>
              <span>✓ 购买时才需要登录</span>
            </div>
          </div>

          <div className="hero-proof-grid">
            <div className="hero-proof">
              <strong>FREE</strong>
              <span>先看内容质量和表达方式</span>
            </div>
            <div className="hero-proof">
              <strong>REGIONAL</strong>
              <span>只为你真正关注的区域付费</span>
            </div>
            <div className="hero-proof">
              <strong>GLOBAL</strong>
              <span>一次覆盖全部国家与后续新增内容</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="plans">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">CHOOSE YOUR ACCESS</p>
              <h2>按真正需要的范围选择</h2>
            </div>
            <p>
              不鼓励为了看一篇内容就购买最高方案。先看免费内容，再根据目的地和使用频率选择。
            </p>
          </div>

          <div className="plan-grid">
            <div className="card plan-card">
              <p className="eyebrow">FREE</p>
              <h3 className="plan-name">免费浏览</h3>
              <div className="plan-price">¥0</div>
              <p className="plan-caption">无需登录，无需绑定支付方式</p>
              <div className="plan-for">适合：第一次进入网站，先判断内容是否有用</div>
              <ul className="plan-features">
                <li>浏览全部国家和城市目录</li>
                <li>免费图文完整阅读</li>
                <li>免费视频直接播放</li>
                <li>会员内容查看介绍与免费预览</li>
              </ul>
              <Link href="/guides" className="btn">
                继续免费浏览
              </Link>
            </div>

            <div className="card plan-card recommended">
              <span className="plan-ribbon">多数用户更适合</span>
              <p className="eyebrow">REGIONAL</p>
              <h3 className="plan-name">区域会员</h3>
              <div className="plan-price">按区域开通</div>
              <p className="plan-caption">实际价格和有效期以支付页面为准</p>
              <div className="plan-for">适合：近期只关注一个区域或少数几个国家</div>
              <ul className="plan-features">
                <li>解锁指定区域完整图文和视频</li>
                <li>查看预算、区域和路线细节</li>
                <li>获得对应区域后续内容更新</li>
                <li>无需为暂时用不到的国家买单</li>
              </ul>
              <CheckoutButton plan="regional" />
            </div>

            <div className="card plan-card">
              <p className="eyebrow">GLOBAL</p>
              <h3 className="plan-name">全站会员</h3>
              <div className="plan-price">全站解锁</div>
              <p className="plan-caption">实际价格和有效期以支付页面为准</p>
              <div className="plan-for">适合：长期关注、多国出行或需要完整资料库</div>
              <ul className="plan-features">
                <li>解锁全部国家和城市内容</li>
                <li>完整图文、视频和深度资料</li>
                <li>后续新增城市持续开放</li>
                <li>同一账户统一管理会员权限</li>
              </ul>
              <CheckoutButton plan="global" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">PLAN COMPARISON</p>
              <h2>三个方案差在哪里</h2>
            </div>
            <p>把免费、区域和全站权限放在一张表里，避免客户看完仍然不知道应该选哪个。</p>
          </div>

          <div className="comparison-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>权益</th>
                  <th>免费</th>
                  <th>区域会员</th>
                  <th>全站会员</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">PURCHASE FLOW</p>
              <h2>购买流程只有三步</h2>
            </div>
            <p>浏览阶段不打扰用户，真正准备购买时再完成登录和支付。</p>
          </div>
          <div className="buy-steps">
            <div className="card buy-step">
              <p className="eyebrow">01</p>
              <strong>先浏览和试看</strong>
              <p className="muted">从免费内容、摘要和预览里确认内容是否符合自己的需求。</p>
            </div>
            <div className="card buy-step">
              <p className="eyebrow">02</p>
              <strong>选择对应范围</strong>
              <p className="muted">只看一个区域就选区域会员，需要长期使用再选择全站会员。</p>
            </div>
            <div className="card buy-step">
              <p className="eyebrow">03</p>
              <strong>登录并完成支付</strong>
              <p className="muted">权限绑定到登录账户，以后使用同一账户即可查看已购内容。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <div>
              <p className="eyebrow">COMMON QUESTIONS</p>
              <h2>购买前常见问题</h2>
            </div>
          </div>
          <div className="faq-grid">
            {FAQS.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <p className="notice" style={{ marginTop: 24 }}>
            正式收款前，请在支付页面明确展示准确价格、有效期、退款政策和是否自动续费。数字内容开通后能否退款，应以支付前展示的正式规则为准。
          </p>
        </div>
      </section>
    </main>
  );
}
