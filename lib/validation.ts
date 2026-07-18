import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(180),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  country: z.string().min(1).max(60),
  city: z.string().min(1).max(60),
  cover_url: z.string().url().nullable().optional(),
  access_level: z.enum(["free", "regional", "global"]),
  status: z.enum(["draft", "published"])
});
