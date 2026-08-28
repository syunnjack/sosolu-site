// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// @astrojs/sitemap は外した。SSRのルート（/c/{slug}/ の41ページ）を列挙できず、
// トップの1URLだけのサイトマップを出してしまうため。
// 代わりに src/pages/sitemap.xml.ts で全URLを組み立てている。
export default defineConfig({
  site: 'https://sosolu.tokyo',
  output: 'server',
  adapter: vercel(),
});
