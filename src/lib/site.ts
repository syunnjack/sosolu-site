/**
 * サイト全体で共有する定数。
 *
 * ドメイン方針は docs/DOMAINS.md を参照。本番は sosolu.tokyo 一本で、
 * 保有している他ドメインはすべてここへ301で寄せる（重複コンテンツ回避）。
 */

export const SITE_NAME = 'sosolu.tokyo';
export const SITE_URL = 'https://sosolu.tokyo';
export const CANONICAL_HOST = 'sosolu.tokyo';

export const SITE_TAGLINE = 'ジャンル別ランキングサイト比較ハブ';
export const SITE_DESCRIPTION =
  'ジャンルごとに分かれた作品ランキングサイトを、実際に使ったユーザーのレビューをもとに横断比較できるメタ比較ハブです。';

/**
 * sosolu.tokyo へ301で寄せるドメイン一覧（docs/DOMAINS.md の「残り18ドメイン」）。
 *
 * 明示的な許可リストにしている。ワイルドカード（「canonical以外は全部飛ばす」）に
 * すると、将来このアプリに別ドメインを向けたときに気付かないまま巻き込むため。
 *
 * sosolu.site は別サイト（カラフルBOXで稼働中）なので**絶対に含めない**。
 */
export const REDIRECT_HOSTS: readonly string[] = [
  'sosolu.link',
  'sosolu.blog',
  'sosolu.online',
  'sosolu.life',
  'sosolu.space',
  'sosolu.email',
  'sosolu.pro',
  'sosolu.xyz',
  'sosolu.shop',
  'sosolu.help',
  'sosoru.site',
  'sosoru.me',
  'sosoru.link',
  'sosoru.life',
  'sosoru.pro',
  'sosoru.email',
  'sosoru.tokyo',
  'sosoru.shop',
];

/** 年齢確認の同意を保存するキー。localStorage と Cookie で同じ名前を使う。 */
export const AGE_CONSENT_KEY = 'sosolu-age-ok';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
