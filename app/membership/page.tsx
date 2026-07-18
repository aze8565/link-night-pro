import { CheckoutButton } from "@/components/checkout-button";

export default function MembershipPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">MEMBERSHIP</p>
            <h2>按你真正需要的范围开通</h2>
          </div>
          <p>免费先建立判断，区域会员解决一组国家，全球会员持续覆盖全部新增城市。</p>
        </div>

        <div className="pricing-grid">
          <div className="card pricing-card">
            <p className="eyebrow">FREE</p>
            <h3>免费用户</h3>
            <div className="price">¥0</div>
            <ul>
              <li>城市概览</li>
              <li>基础预算</li>
              <li>安全提醒</li>
              <li>公开视频</li>
            </ul>
            <a href="/guides" className="btn">先看免费内容</a>
          </div>

          <div className="card pricing-card featured">
            <p className="eyebrow">REGIONAL</p>
            <h3>区域会员</h3>
            <div className="price">后台配置</div>
            <ul>
              <li>区域完整攻略</li>
              <li>48小时路线</li>
              <li>季度更新</li>
              <li>会员内容权限</li>
            </ul>
            <CheckoutButton plan="regional" />
          </div>

          <div className="card pricing-card">
            <p className="eyebrow">GLOBAL</p>
            <h3>全球会员</h3>
            <div className="price">后台配置</div>
            <ul>
              <li>全部国家内容</li>
              <li>新增城市持续更新</li>
              <li>全球路线模板</li>
              <li>会员管理中心</li>
            </ul>
            <CheckoutButton plan="global" />
          </div>
        </div>

        <p className="notice" style={{ marginTop: 24 }}>
          会员为自动续费数字内容订阅。付款前请查看价格、周期、退款政策与当地适用规则；可在账户中心取消后续续费。
        </p>
      </div>
    </main>
  );
}
