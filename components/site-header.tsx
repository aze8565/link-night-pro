import Link from "next/link";
import { getViewer } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  const { user, profile } = await getViewer();
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <span className="brand-mark">霖K</span>
          <span>海外夜娱地图<small>GLOBAL NIGHT MAP</small></span>
        </Link>
        <nav className="nav-links">
          <Link href="/guides">目的地攻略</Link>
          <Link href="/membership">会员</Link>
          {profile && ["editor", "admin"].includes(profile.role) && <Link href="/admin">内容后台</Link>}
          {user ? (
            <><Link href="/account" className="keep">我的账户</Link><LogoutButton /></>
          ) : (
            <Link href="/login" className="btn btn-small btn-primary keep">登录</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
