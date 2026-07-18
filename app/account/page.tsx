import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PortalButton } from "@/components/portal-button";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; admin?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const isEditor = profile?.role === "admin" || profile?.role === "editor";

  return (
    <main className="section">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">MY ACCOUNT</p>
            <h2>我的账户</h2>
          </div>
        </div>
        {params.admin === "ready" && (
          <p className="notice success">管理员后台已初始化完成。</p>
        )}
        {params.error && (
          <p className="notice error">初始化失败：{params.error}</p>
        )}
        <div className="account-grid">
          <div className="card">
            <h3>账户信息</h3>
            <p>邮箱：{user.email}</p>
            <p>角色：{profile?.role ?? "user"}</p>
            <p>内容权限：{profile?.plan ?? "free"}</p>
            {isEditor ? (
              <a href="/admin" className="btn btn-primary">
                进入内容管理后台
              </a>
            ) : (
              <a href="/setup-admin" className="btn btn-primary">
                初始化管理员后台
              </a>
            )}
          </div>
          <div className="card">
            <h3>会员状态</h3>
            <p>状态：{membership?.status ?? "未开通"}</p>
            <p>当前计划：{membership?.plan ?? "free"}</p>
            {membership?.stripe_customer_id ? (
              <PortalButton />
            ) : (
              <a href="/membership" className="btn btn-primary">
                开通会员
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
