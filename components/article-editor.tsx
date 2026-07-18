"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  AccessLevel,
  Article,
  ArticleStatus,
  ContentType,
} from "@/lib/types";
import { Markdown } from "@/components/markdown";
import { VideoPlayer } from "@/components/video-player";

type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  preview_content: string;
  content: string;
  content_type: ContentType;
  video_url: string;
  duration_text: string;
  is_featured: boolean;
  country: string;
  city: string;
  cover_url: string | null;
  access_level: AccessLevel;
  status: ArticleStatus;
};

const blank: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  preview_content: "",
  content: "",
  content_type: "article",
  video_url: "",
  duration_text: "",
  is_featured: false,
  country: "",
  city: "",
  cover_url: null,
  access_level: "free",
  status: "draft",
};

export function ArticleEditor({ initial }: { initial?: Article }) {
  const [draft, setDraft] = useState<Draft>(
    initial
      ? {
          title: initial.title,
          slug: initial.slug,
          excerpt: initial.excerpt,
          preview_content: initial.preview_content ?? "",
          content: initial.content,
          content_type: initial.content_type ?? "article",
          video_url: initial.video_url ?? "",
          duration_text: initial.duration_text ?? "",
          is_featured: initial.is_featured ?? false,
          country: initial.country,
          city: initial.city,
          cover_url: initial.cover_url,
          access_level: initial.access_level,
          status: initial.status,
        }
      : blank,
  );
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const generatedSlug = useMemo(
    () => draft.slug || draft.title.trim().toLowerCase().replace(/\s+/g, "-"),
    [draft.slug, draft.title],
  );

  async function upload(file: File) {
    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("cover-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("cover-images").getPublicUrl(path);
      update("cover_url", data.publicUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  }

  async function save(status: ArticleStatus) {
    setBusy(true);
    try {
      const payload = {
        ...draft,
        slug: generatedSlug,
        status,
        preview_content: draft.preview_content || null,
        video_url: draft.content_type === "video" ? draft.video_url || null : null,
        duration_text:
          draft.content_type === "video" ? draft.duration_text || null : null,
      };
      const url = initial
        ? `/api/admin/articles/${initial.id}`
        : "/api/admin/articles";
      const response = await fetch(url, {
        method: initial ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "保存失败");
      location.href = "/admin/articles";
    } catch (error) {
      alert(error instanceof Error ? error.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="editor-grid">
      <div>
        {preview ? (
          <div className="markdown-preview">
            <span className="pill">
              {draft.content_type === "video" ? "视频" : "图文"} · {draft.access_level === "free" ? "免费" : "会员"}
            </span>
            <h1>{draft.title || "未命名内容"}</h1>
            <p className="muted">{draft.excerpt}</p>
            {draft.content_type === "video" && draft.video_url && (
              <VideoPlayer url={draft.video_url} title={draft.title || "视频预览"} />
            )}
            {draft.preview_content && (
              <div className="preview-block">
                <Markdown content={draft.preview_content} />
              </div>
            )}
            <Markdown content={draft.content} />
          </div>
        ) : (
          <div className="form">
            <div className="field">
              <label>内容类型</label>
              <select
                className="select"
                value={draft.content_type}
                onChange={(event) =>
                  update("content_type", event.target.value as ContentType)
                }
              >
                <option value="article">图文攻略</option>
                <option value="video">视频攻略</option>
              </select>
            </div>

            <div className="field">
              <label>标题</label>
              <input
                className="input"
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="例如：第一次去曼谷，先看懂这三个区域"
              />
            </div>

            <div className="field">
              <label>网址别名（可留空自动生成）</label>
              <input
                className="input"
                value={draft.slug}
                onChange={(event) => update("slug", event.target.value)}
                placeholder={generatedSlug}
              />
            </div>

            <div className="field">
              <label>卡片摘要</label>
              <textarea
                className="input"
                rows={4}
                value={draft.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
                placeholder="所有访客都能看到，用来介绍这篇内容解决什么问题。"
              />
            </div>

            {draft.content_type === "video" && (
              <>
                <div className="field">
                  <label>视频链接</label>
                  <input
                    className="input"
                    value={draft.video_url}
                    onChange={(event) => update("video_url", event.target.value)}
                    placeholder="支持 YouTube、Vimeo 或 MP4 直链"
                  />
                </div>
                <div className="field">
                  <label>视频时长（可选）</label>
                  <input
                    className="input"
                    value={draft.duration_text}
                    onChange={(event) => update("duration_text", event.target.value)}
                    placeholder="例如：08:35"
                  />
                </div>
              </>
            )}

            <div className="field">
              <label>免费预览内容（付费内容建议填写）</label>
              <textarea
                className="textarea textarea-preview"
                value={draft.preview_content}
                onChange={(event) => update("preview_content", event.target.value)}
                placeholder={"## 你会先看到什么\n\n这里填写所有访客都能查看的前言、目录或试看内容。"}
              />
            </div>

            <div className="field">
              <label>完整内容（Markdown）</label>
              <textarea
                className="textarea"
                value={draft.content}
                onChange={(event) => update("content", event.target.value)}
                placeholder={"## 一、区域结构\n\n正文内容..."}
              />
            </div>
          </div>
        )}
      </div>

      <aside className="editor-side">
        <div className="card">
          <div className="field">
            <label>国家</label>
            <input
              className="input"
              value={draft.country}
              onChange={(event) => update("country", event.target.value)}
              placeholder="泰国"
            />
          </div>
          <div className="field">
            <label>城市</label>
            <input
              className="input"
              value={draft.city}
              onChange={(event) => update("city", event.target.value)}
              placeholder="曼谷"
            />
          </div>
          <div className="field">
            <label>观看权限</label>
            <select
              className="select"
              value={draft.access_level}
              onChange={(event) =>
                update("access_level", event.target.value as AccessLevel)
              }
            >
              <option value="free">免费公开</option>
              <option value="regional">区域会员</option>
              <option value="global">全站会员</option>
            </select>
          </div>
          <label className="check-row">
            <input
              type="checkbox"
              checked={draft.is_featured}
              onChange={(event) => update("is_featured", event.target.checked)}
            />
            首页重点推荐
          </label>
        </div>

        <div className="card">
          <div className="field">
            <label>封面图</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(event) =>
                event.target.files?.[0] && upload(event.target.files[0])
              }
            />
            {draft.cover_url && (
              <img
                className="image-preview"
                src={draft.cover_url}
                alt="封面预览"
              />
            )}
          </div>
        </div>

        <button className="btn" onClick={() => setPreview(!preview)}>
          {preview ? "返回编辑" : "预览内容"}
        </button>
        <button className="btn" disabled={busy} onClick={() => save("draft")}>
          保存草稿
        </button>
        <button
          className="btn btn-primary"
          disabled={busy}
          onClick={() => save("published")}
        >
          {busy ? "处理中..." : "发布内容"}
        </button>
      </aside>
    </div>
  );
}
