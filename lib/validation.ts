import { z } from "zod";

export const articleSchema = z
  .object({
    title: z.string().min(2).max(160),
    slug: z.string().min(2).max(180),
    excerpt: z.string().min(10).max(500),
    preview_content: z.string().max(5000).nullable().optional(),
    content: z.string().min(20),
    content_type: z.enum(["article", "video"]),
    video_url: z.string().url().nullable().optional(),
    duration_text: z.string().max(30).nullable().optional(),
    is_featured: z.boolean().optional(),
    country: z.string().min(1).max(60),
    city: z.string().min(1).max(60),
    cover_url: z.string().url().nullable().optional(),
    access_level: z.enum(["free", "regional", "global"]),
    status: z.enum(["draft", "published"]),
  })
  .superRefine((value, ctx) => {
    if (value.content_type === "video" && !value.video_url) {
      ctx.addIssue({
        code: "custom",
        path: ["video_url"],
        message: "视频内容必须填写视频链接",
      });
    }
  });
