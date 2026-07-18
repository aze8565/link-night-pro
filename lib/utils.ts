import slugify from "slugify";

export function createSlug(value: string) {
  const base = slugify(value, { lower: true, strict: true, locale: "zh" });
  return base || `guide-${Date.now()}`;
}

export function formatDate(value: string | null) {
  if (!value) return "未发布";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function absoluteUrl(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, site).toString();
}
