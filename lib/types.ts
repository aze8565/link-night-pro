export type Role = "user" | "editor" | "admin";
export type Plan = "free" | "regional" | "global";
export type ArticleStatus = "draft" | "published";
export type AccessLevel = Plan;
export type ContentType = "article" | "video";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  plan: Plan;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  preview_content: string | null;
  content_type: ContentType;
  video_url: string | null;
  duration_text: string | null;
  is_featured: boolean;
  country: string;
  city: string;
  cover_url: string | null;
  access_level: AccessLevel;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
};
