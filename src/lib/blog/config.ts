/** Public WordPress reads only; no credentials or CMS frontend navigation. */
export const USE_WORDPRESS_BLOG = true;
export const WORDPRESS_API_BASE = "https://wildwestwagsblog.wordpress.com/wp-json/wp/v2";
// WordPress.com hosted sites can return 404 for /wp-json; its public v2 API
// exposes the same posts, meta and _embed data without authentication.
export const WORDPRESS_PUBLIC_API_BASE = "https://public-api.wordpress.com/wp/v2/sites/wildwestwagsblog.wordpress.com";