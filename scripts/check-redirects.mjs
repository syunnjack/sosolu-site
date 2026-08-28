#!/usr/bin/env node
/**
 * 保有ドメインが sosolu.tokyo へ正しく301で寄っているか確認する。
 *
 * 18ドメインをVercelに追加する作業は手数が多く、1件抜けても画面上は
 * 気付きにくい（そのドメインで開くと普通にサイトが見えてしまうため）。
 * 設定後にこれを流せば、抜けとリダイレクト先の誤りをまとめて洗い出せる。
 *
 *   node scripts/check-redirects.mjs
 *
 * DNSを切り替える前に、デプロイ先へ直接投げて middleware の挙動だけ
 * 先に確かめたい場合は --via を使う。Host を詐称して送るので、
 * ドメインがまだVercelを向いていなくても検証できる。
 *
 *   node scripts/check-redirects.mjs --via https://sosolu-site.vercel.app
 *   node scripts/check-redirects.mjs --via http://localhost:4321
 */

import { CANONICAL_HOST, REDIRECT_HOSTS } from '../src/lib/site.ts';

const viaIndex = process.argv.indexOf('--via');
const via = viaIndex !== -1 ? process.argv[viaIndex + 1] : null;

if (viaIndex !== -1 && !via) {
  console.error('--via にはURLを指定してください（例: --via https://sosolu-site.vercel.app）');
  process.exit(2);
}

/** 深いURLでもパスとクエリを保って寄るか見たいので、ルート以外も試す。 */
const PATHS = ['/', '/c/kijoi/?utm_source=check'];

/** @type {{host: string, path: string, expected: string, actual: string|null, status: number|null, ok: boolean, note?: string}[]} */
const results = [];

async function probe(host, path) {
  const expected = `https://${CANONICAL_HOST}${path}`;
  const target = via ? new URL(path, via).toString() : `https://${host}${path}`;
  const headers = via ? { 'x-forwarded-host': host } : {};

  try {
    const res = await fetch(target, { redirect: 'manual', headers });
    const location = res.headers.get('location');
    return {
      host,
      path,
      expected,
      actual: location,
      status: res.status,
      ok: res.status === 301 && location === expected,
    };
  } catch (error) {
    return {
      host,
      path,
      expected,
      actual: null,
      status: null,
      ok: false,
      note: error instanceof Error ? error.message : String(error),
    };
  }
}

// 本番ホストは寄せる側ではないので、200が返ることだけ確かめる。
async function probeCanonical() {
  const target = via ? new URL('/', via).toString() : `https://${CANONICAL_HOST}/`;
  const headers = via ? { 'x-forwarded-host': CANONICAL_HOST } : {};

  try {
    const res = await fetch(target, { redirect: 'manual', headers });
    return {
      host: CANONICAL_HOST,
      path: '/',
      expected: '200 (リダイレクトされないこと)',
      actual: String(res.status),
      status: res.status,
      ok: res.status === 200,
    };
  } catch (error) {
    return {
      host: CANONICAL_HOST,
      path: '/',
      expected: '200 (リダイレクトされないこと)',
      actual: null,
      status: null,
      ok: false,
      note: error instanceof Error ? error.message : String(error),
    };
  }
}

console.log(via ? `検証先: ${via}（Hostを詐称して送信）\n` : '検証先: 実際のDNS\n');

results.push(await probeCanonical());

for (const host of REDIRECT_HOSTS) {
  for (const path of PATHS) {
    results.push(await probe(host, path));
  }
}

// www 付きの本番ドメインも寄る対象。
results.push(await probe(`www.${CANONICAL_HOST}`, '/'));

let failed = 0;
for (const r of results) {
  const mark = r.ok ? 'OK  ' : 'NG  ';
  if (!r.ok) failed++;
  let actual;
  if (r.actual) {
    actual = `${r.actual}${r.status ? ` [HTTP ${r.status}]` : ''}`;
  } else if (r.status !== null) {
    // 応答はあるがLocationが無い＝寄せられていない。「応答なし」と書くと原因を誤らせる。
    actual = `リダイレクトされませんでした [HTTP ${r.status}]`;
  } else {
    actual = `接続できませんでした (${r.note ?? '原因不明'})`;
  }
  const detail = r.ok ? '' : `\n      期待: ${r.expected}\n      実際: ${actual}`;
  console.log(`${mark}${r.host}${r.path}${detail}`);
}

console.log(`\n${results.length - failed} / ${results.length} 件が期待どおりです。`);

if (failed > 0) {
  console.log('\nNG のドメインは、Vercelプロジェクトへの追加またはDNSの設定が済んでいない可能性があります。');
  console.log('docs/DOMAINS.md の「実施手順」を確認してください。');
  process.exit(1);
}
