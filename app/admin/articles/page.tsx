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
          <p className="eyebrow">ARTICLES</p>
          <h1>文章管理</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/articles/new">
          发布文章
        </Link>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
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
                <td>
                  {article.country}/{article.city}
                </td>
                <td>{article.access_level}</td>
                <td>{article.status}</td>
                <td>{formatDate(article.updated_at)}</td>
                <td>
                  <Link
                    className="btn btn-small"
                    href={`/admin/articles/${article.id}`}
                  >
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
