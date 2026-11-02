export type BlogImage = { url: string; alt: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitized HTML body. */
  content: string;
  image: BlogImage | null;
  author: string;
  authorLine: string;
  authorFooter: string;
  metaDescription: string;
  /** ISO date; null when the source supplies none (local posts). */
  date: string | null;
};

export type BlogListResult = { posts: BlogPost[]; totalPages: number; error: boolean };
export type BlogPostResult = { post: BlogPost | null; error: boolean };
