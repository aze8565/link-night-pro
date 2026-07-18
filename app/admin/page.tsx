import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const db = await createClient();
  const [
    { count: articles },
    { count: published },
    { count: members },
    { count: users },
  ] = await Promise.all([
    db.from("articles").select("*", { count: "exact", head: true }),
    db
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    db
      .from("memberships")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    db.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <p className="eyebrow">CMS DASHBOARD</p>
          <h1>内容管理后台</h1>
        </div>
        <a className="btn btn-primary" href="/admin/articles/new">
          写新文章
        </a>
      </div>
      <div className="stat-grid">
        <div className="card stat">
          <span>全部文章</span>
          <strong>{articles ?? 0}</strong>
        </div>
        <div className="card stat">
          <span>已发布</span>
          <strong>{published ?? 0}</strong>
        </div>
        <div className="card stat">
          <span>有效会员</span>
          <strong>{members ?? 0}</strong>
        </div>
        <div className="card stat">
          <span>注册用户</span>
          <strong>{users ?? 0}</strong>
        </div>
      </div>
    </>
  );
}
