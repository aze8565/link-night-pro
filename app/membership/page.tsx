import { CheckoutButton } from "@/components/checkout-button";

export default function MembershipPage() {
  return (
    <main className="section pricing-page">
      <div className="container">
        <div className="library-heading">
          <div>
            <p className="eyebrow">MEMBERSHIP</p>
            <h1>免费先看，确定需要再买</h1>
            <p className="muted">
              浏览网站、观看免费视频和阅读免费攻略都不需要登录。只有购买会员或查看已购内容时，才需要账户。
            </p>
          </div>
          <a className="btn" href="/videos">先看免费内容</a>
        </div>

        <div className="pricing-grid">
          <div className="card pricing-card">
            <p className="eyebrow">FREE</p>
            <h3>免费内容</h3>
            <div className="price">¥0</div>
            <ul>
              <li>无需登录即可浏览</li>
              <li>免费视频直接播放</li>
              <li>免费图文完整阅读</li>
              <li>付费内容可先看介绍与预览</li>
            </ul>
            <a href="/guides" className="btn">继续免费浏览</a>
          </div>

          <div className="card pricing-card featured">
            <p className="eyebrow">REGIONAL</p>
            <h3>区域会员</h3>
            <div className="price">后台配置</div>
            <ul>
              <li>解锁指定区域会员内容</li>
              <li>完整视频与深度图文</li>
              <li>预算、路线和更新记录</li>
              <li>适合只关注一个地区的用户</li>
            </ul>
            <CheckoutButton plan="regional" />
          </div>

          <div className="card pricing-card">
            <p className="eyebrow">GLOBAL</p>
            <h3>全站会员</h3>
            <div className="price">后台配置</div>
            <ul>
              <li>解锁全部国家和城市</li>
              <li>新增内容持续开放</li>
              <li>完整图文、视频和资料</li>
              <li>适合长期关注与多国出行</li>
            </ul>
            <CheckoutButton plan="global" />
          </div>
        </div>

        <div className="card purchase-note">
          <h3>购买流程</h3>
          <p>
            浏览内容不需要注册。点击购买时再登录账户，完成支付后系统为该账户开通对应权限；以后登录即可查看已购买内容。
          </p>
        </div>

        <p className="notice" style={{ marginTop: 24 }}>
          正式收款前，请在后台填写准确价格、有效期、退款政策和支付渠道。数字内容的退款与续费规则应在付款页面清楚展示。
        </p>
      </div>
    </main>
  );
}
