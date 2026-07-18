import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  const db = await createClient();
  const { data } = await db
    .from("profiles")
    .select("id,email,display_name,role,plan,created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      <div className="admin-head">
        <div>
          <p className="eyebrow">MEMBERS</p>
          <h1>用户与会员</h1>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>邮箱</th>
              <th>昵称</th>
              <th>角色</th>
              <th>计划</th>
              <th>注册时间</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((profile) => (
              <tr key={profile.id}>
                <td>{profile.email}</td>
                <td>{profile.display_name ?? "-"}</td>
                <td>{profile.role}</td>
                <td>{profile.plan}</td>
                <td>
                  {new Date(profile.created_at).toLocaleDateString("zh-CN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="notice" style={{ marginTop: 16 }}>
        管理员和编辑角色建议在 Supabase 后台修改，避免前台误操作提升权限。
      </p>
    </>
  );
}
