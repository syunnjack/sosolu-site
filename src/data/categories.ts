export interface Category {
  slug: string;
  name: string;
  group: string;
  repo: string;
  description: string;
  /** Live ranking site URL once the source repo is deployed. null = coming soon. */
  externalUrl: string | null;
}

export const groups = [
  'プレイスタイル・体位',
  'NTR・寝取られ系',
  '職業・コスプレ系',
  '女性属性系',
  'シチュエーション',
  'メディア形態',
  '横断・メタ',
] as const;

export const categories: Category[] = [
  { slug: 'back-piston', name: 'バックピストン', group: 'プレイスタイル・体位', repo: 'back-piston-ranking', description: 'バックピストンに特化した作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'hard-piston', name: 'ハードピストン', group: 'プレイスタイル・体位', repo: 'hard-piston-ranking', description: 'ハードピストン系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'kijoi', name: '騎乗位', group: 'プレイスタイル・体位', repo: 'kijoi-ranking', description: '騎乗位作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'neback', name: '寝バック', group: 'プレイスタイル・体位', repo: 'neback-ranking', description: '寝バック作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'tachiback', name: '立ちバック', group: 'プレイスタイル・体位', repo: 'tachiback-ranking', description: '立ちバック作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'taimenzai', name: '対面座位', group: 'プレイスタイル・体位', repo: 'taimenzai-ranking', description: '対面座位作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'playincar', name: '車内プレイ', group: 'プレイスタイル・体位', repo: 'playincar-ranking', description: '車内シチュエーション作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-inbus', name: 'バス内プレイ', group: 'プレイスタイル・体位', repo: 'play-inbus-ranking', description: 'バス内シチュエーション作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-inplane', name: '飛行機内プレイ', group: 'プレイスタイル・体位', repo: 'play-inplane-ranking', description: '飛行機内シチュエーション作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-intrain', name: '電車内プレイ', group: 'プレイスタイル・体位', repo: 'play-intrain-ranking', description: '電車内シチュエーション作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'ikigaman', name: 'イキ我慢', group: 'プレイスタイル・体位', repo: 'ikigaman-ranking', description: 'イキ我慢作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'ohogao', name: 'オホ声', group: 'プレイスタイル・体位', repo: 'ohogao-ranking', description: 'オホ声作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'ahegao', name: 'アヘ顔', group: 'プレイスタイル・体位', repo: 'ahegao-ranking', description: 'アヘ顔作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'mesuiki', name: 'メスイキ', group: 'プレイスタイル・体位', repo: 'mesuiki-ranking', description: 'メスイキ作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'mesuochi', name: 'メス堕ち', group: 'プレイスタイル・体位', repo: 'mesuochi-ranking', description: 'メス堕ち作品のランキングサイトを比較します。', externalUrl: null },

  { slug: 'netorare', name: 'NTR（寝取られ）', group: 'NTR・寝取られ系', repo: 'netorare-ranking', description: 'NTR（寝取られ）作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'netorase', name: 'NTS（寝取らせ）', group: 'NTR・寝取られ系', repo: 'netorase-ranking', description: 'NTS（寝取らせ）作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'gyakyu-netorare', name: '逆NTR', group: 'NTR・寝取られ系', repo: 'gyakyu-netorare-ranking', description: '逆NTR作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'ntr-exchange', name: 'NTR・寝取られ交換', group: 'NTR・寝取られ系', repo: 'ntr-exchange-ranking', description: '寝取られ交換系作品のランキングサイトを比較します。', externalUrl: null },

  { slug: 'play-withca', name: 'CA（客室乗務員）', group: '職業・コスプレ系', repo: 'play-withca-ranking', description: 'CA（客室乗務員）ものランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-with-stewardess', name: 'スチュワーデス', group: '職業・コスプレ系', repo: 'play-with-stewardess-ranking', description: 'スチュワーデスものランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-with-racequeen', name: 'レースクイーン', group: '職業・コスプレ系', repo: 'play-with-racequeen-ranking', description: 'レースクイーンものランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-with-roundgirl', name: 'ラウンドガール', group: '職業・コスプレ系', repo: 'play-with-roundgirl-ranking', description: 'ラウンドガールものランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-with-promotionalgirl', name: 'キャンペーンガール', group: '職業・コスプレ系', repo: 'play-with-promotionalgirl-ranking', description: 'キャンペーンガールものランキングサイトを比較します。', externalUrl: null },
  { slug: 'play-withladies', name: 'お姉さん系', group: '職業・コスプレ系', repo: 'play-withladies-ranking', description: 'お姉さん系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'kosupure', name: 'コスプレ', group: '職業・コスプレ系', repo: 'kosupure-ranking', description: 'コスプレ作品のランキングサイトを比較します。', externalUrl: null },

  { slug: 'gyaru', name: 'ギャル', group: '女性属性系', repo: 'gyaru-ranking', description: 'ギャル系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'chijo', name: '痴女', group: '女性属性系', repo: 'chijo-ranking', description: '痴女系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'kyonyu', name: '巨乳', group: '女性属性系', repo: 'kyonyu-ranking', description: '巨乳系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'mature', name: '熟女', group: '女性属性系', repo: 'mature-genre-ranking', description: '熟女系作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'shirouto', name: '素人', group: '女性属性系', repo: 'shirouto-ranking', description: '素人系作品のランキングサイトを比較します。', externalUrl: null },

  { slug: 'onsen', name: '温泉', group: 'シチュエーション', repo: 'onsen-ranking', description: '温泉シチュエーション作品のランキングサイトを比較します。', externalUrl: null },
  { slug: 'shibari', name: '緊縛', group: 'シチュエーション', repo: 'shibari-ranking', description: '緊縛作品のランキングサイトを比較します。', externalUrl: null },

  { slug: 'adult-comic', name: 'アダルトコミック', group: 'メディア形態', repo: 'adult-comic-ranking', description: 'アダルトコミックのランキングサイトを比較します。', externalUrl: null },
  { slug: 'adult-figure', name: 'アダルトフィギュア', group: 'メディア形態', repo: 'adult-figure-ranking', description: 'アダルトフィギュアのランキングサイトを比較します。', externalUrl: null },
  { slug: 'adult-novel', name: 'アダルト小説', group: 'メディア形態', repo: 'adult-novel-ranking', description: 'アダルト小説のランキングサイトを比較します。', externalUrl: null },
  { slug: 'bl-tl-doujin', name: 'BL・TL同人', group: 'メディア形態', repo: 'bl-tl-doujin-ranking', description: 'BL・TL同人のランキングサイトを比較します。', externalUrl: null },
  { slug: 'bl-tl-novel', name: 'BL・TL小説', group: 'メディア形態', repo: 'bl-tl-novel-ranking', description: 'BL・TL小説のランキングサイトを比較します。', externalUrl: null },
  { slug: 'r18-anime', name: 'R18アニメ', group: 'メディア形態', repo: 'r18-anime-ranking', description: 'R18アニメのランキングサイトを比較します。', externalUrl: null },
  { slug: 'gravure-photo', name: 'グラビア写真', group: 'メディア形態', repo: 'gravure-photo-ranking', description: 'グラビア写真集のランキングサイトを比較します。', externalUrl: null },
  { slug: 'duga-video', name: 'DUGA動画', group: 'メディア形態', repo: 'duga-video-ranking', description: 'DUGA配信動画のランキングサイトを比較します。', externalUrl: null },

  { slug: 'cross-asp', name: '複数ASP横断', group: '横断・メタ', repo: 'cross-asp-ranking', description: '複数ASPを横断した比較ランキングサイトを比較します。', externalUrl: null },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/**
 * 同じグループの他ジャンルを返す。ジャンルページ同士を相互リンクさせ、
 * 回遊とクロールの導線を作るために使う。
 */
export function getRelatedCategories(slug: string, limit = 8): Category[] {
  const current = getCategory(slug);
  if (!current) return [];
  return categories.filter((c) => c.group === current.group && c.slug !== slug).slice(0, limit);
}
