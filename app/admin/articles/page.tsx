import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { DeleteArticleButton } from "@/components/delete-article-button";

export default async function AdminArticlesPage() {
  const db = await createClient();
  const { data } = await db
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  const articles = (data ?? []) as Article[];

  return (
    <>
      <div className="admin-head">
        <div>
          <p className="eyebrow">CONTENT LIBRARY</p>
          <h1>内容管理</h1>
          <p className="muted">一套后台同时发布免费/会员图文和视频。</p>
        </div>
        <Link className="btn btn-primary" href="/admin/articles/new">
          发布新内容
        </Link>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>国家/城市</th>
              <th>权限</th>
              <th>状态</th>
              <th>更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{(article.content_type ?? "article") === "video" ? "视频" : "图文"}</td>
                <td>{article.country}/{article.city}</td>
                <td>
                  {article.access_level === "free"
                    ? "免费"
                    : article.access_level === "regional"
                      ? "区域会员"
                      : "全站会员"}
                </td>
                <td>{article.status === "published" ? "已发布" : "草稿"}</td>
                <td>{formatDate(article.updated_at)}</td>
                <td>
                  <Link className="btn btn-small" href={`/admin/articles/${article.id}`}>
                    编辑
                  </Link>{" "}
                  <DeleteArticleButton id={article.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
