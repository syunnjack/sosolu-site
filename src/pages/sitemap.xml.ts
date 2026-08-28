import type { APIRoute } from 'astro';
import { categories } from '../data/categories';
import { absoluteUrl } from '../lib/site';

/**
 * サイトマップを実際のルートから組み立てる。
 *
 * 以前は public/sitemap.xml に手書きした静的ファイルを置いていたが、
 * 中身が https://sosolu-site.vercel.app の1URLだけで、41件のジャンルページは
 * どこにも載っていなかった。@astrojs/sitemap はSSRのルートを列挙できないため、
 * こちらで全URLを出す。ジャンルを増やしたら自動で反映される。
 */

interface Entry {
  path: string;
  priority: string;
  changefreq: string;
}

const staticEntries: Entry[] = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about/', priority: '0.3', changefreq: 'yearly' },
  { path: '/guidelines/', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy/', priority: '0.3', changefreq: 'yearly' },
];

export const GET: APIRoute = () => {
  const entries: Entry[] = [
    ...staticEntries,
    ...categories.map((c) => ({
      path: `/c/${c.slug}/`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ];

  const urls = entries
    .map(
      (entry) =>
        `  <url>\n` +
        `    <loc>${absoluteUrl(entry.path)}</loc>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
