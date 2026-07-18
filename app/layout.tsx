import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "霖K海外夜娱地图", template: "%s｜霖K海外夜娱地图" },
  description: "海外热门城市夜生活、合法娱乐、商务接待与安全攻略。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
