import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { LOCAL_POSTS } from "./local";
import { wpGetPost, wpListPosts } from "./wordpress";
import type { BlogListResult, BlogPostResult } from "./types";
import { USE_WORDPRESS_BLOG } from "./config";
export { USE_WORDPRESS_BLOG, WORDPRESS_API_BASE } from "./config";

/**
 * Blog provider selector. The UI only talks to listBlogPosts / getBlogPost,
 * so switching to Headless WordPress later is a one-line change here.
 */
const PER_PAGE = 12;

export const listBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ page: z.number().int().min(1).max(500) }).parse(d))
  .handler(async ({ data }): Promise<BlogListResult> => {
    if (USE_WORDPRESS_BLOG) return wpListPosts(data.page);
    const start = (data.page - 1) * PER_PAGE;
    return {
      posts: LOCAL_POSTS.slice(start, start + PER_PAGE),
      totalPages: Math.max(1, Math.ceil(LOCAL_POSTS.length / PER_PAGE)),
      error: false,
    };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().regex(/^[a-z0-9-%]+$/i).max(200) }).parse(d))
  .handler(async ({ data }): Promise<BlogPostResult> => {
    if (USE_WORDPRESS_BLOG) return wpGetPost(data.slug);
    return { post: LOCAL_POSTS.find((p) => p.slug === data.slug) ?? null, error: false };
  });
