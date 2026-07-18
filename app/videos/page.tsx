import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide-card";
import type { Article } from "@/lib/types";

export default async function VideosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const videos = ((data ?? []) as Article[]).filter(
    (item) => (item.content_type ?? "article") === "video",
  );

  return (
    <main className="section content-library">
      <div className="container">
        <div className="library-heading">
          <div>
            <p className="eyebrow">VIDEO GUIDES</p>
            <h1>视频攻略</h1>
            <p className="muted">
              不登录也能浏览全部目录。标记为“免费”的视频可以直接观看，会员视频先看介绍，再决定是否开通。
            </p>
          </div>
          <a className="btn" href="/guides">切换到图文攻略</a>
        </div>

        {videos.length ? (
          <div className="grid grid-3">
            {videos.map((video) => (
              <GuideCard article={video} key={video.id} />
            ))}
          </div>
        ) : (
          <div className="card empty">
            这里将展示你从后台发布的视频。先在“内容后台”新建内容，并把内容类型选择为“视频”。
          </div>
        )}
      </div>
    </main>
  );
}
