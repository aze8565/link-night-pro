import Link from "next/link";
import { requireEditor } from "@/lib/auth";
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireEditor();return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin">后台首页</Link><Link href="/admin/articles">文章管理</Link><Link href="/admin/articles/new">发布文章</Link><Link href="/admin/members">会员用户</Link><Link href="/">返回前台</Link></aside><main className="admin-main">{children}</main></div>}
