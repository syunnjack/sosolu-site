#!/usr/bin/env node
/**
 * Vercelプロジェクトに本番ドメインと寄せ先ドメインを一括登録する。
 *
 * ダッシュボードで19件を手で追加するのは手数が多く、途中で1件飛ばしても
 * 気付きにくい。登録対象は src/lib/site.ts をそのまま読むので、
 * コードと設定がずれない。
 *
 * 既定は下見（dry run）で、何も変更せず「これから何を足すか」だけ出す。
 * 実際に追加するには --apply を付ける。
 *
 *   node scripts/vercel-domains.mjs
 *   node scripts/vercel-domains.mjs --apply
 *
 * 必要な環境変数:
 *   VERCEL_TOKEN       … https://vercel.com/account/tokens で発行
 *   VERCEL_PROJECT_ID  … プロジェクトの Settings → General
 *   VERCEL_TEAM_ID     … 個人アカウントなら不要
 */

import { CANONICAL_HOST, REDIRECT_HOSTS } from '../src/lib/site.ts';

/**
 * 触ってはいけないドメイン。
 *
 * sosolu.site はカラフルBOXで別サイトが稼働している。Vercelに追加すると
 * DNSを奪ってそちらを落とすため、コード側で二重に止める。
 * docs/DOMAINS.md の「重要」の項を参照。
 */
const FORBIDDEN = ['sosolu.site'];

const apply = process.argv.includes('--apply');
const api = process.env.VERCEL_API ?? 'https://api.vercel.com';
const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token || !projectId) {
  console.error('VERCEL_TOKEN と VERCEL_PROJECT_ID を設定してください。');
  process.exit(2);
}

const wanted = [CANONICAL_HOST, ...REDIRECT_HOSTS];

// 設定ミスや取り違えで別サイトを巻き込まないよう、実行前に必ず確かめる。
const violations = wanted.filter((d) => FORBIDDEN.includes(d));
if (violations.length > 0) {
  console.error(`登録対象に触れてはいけないドメインが含まれています: ${violations.join(', ')}`);
  console.error('src/lib/site.ts を確認してください。処理を中止します。');
  process.exit(2);
}

const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';

async function callApi(path, init = {}) {
  const res = await fetch(`${api}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function listExisting() {
  const sep = query ? '&' : '?';
  const { ok, status, body } = await callApi(
    `/v9/projects/${encodeURIComponent(projectId)}/domains${query}${sep}limit=100`,
  );
  if (!ok) {
    throw new Error(`ドメイン一覧を取得できませんでした (HTTP ${status}): ${JSON.stringify(body)}`);
  }
  return new Set((body.domains ?? []).map((d) => d.name));
}

async function addDomain(name) {
  return callApi(`/v10/projects/${encodeURIComponent(projectId)}/domains${query}`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

const existing = await listExisting();
const missing = wanted.filter((d) => !existing.has(d));

console.log(`登録対象: ${wanted.length} 件（本番 ${CANONICAL_HOST} + 寄せ先 ${REDIRECT_HOSTS.length} 件）`);
console.log(`登録済み: ${wanted.filter((d) => existing.has(d)).length} 件`);
console.log(`未登録:   ${missing.length} 件\n`);

if (missing.length === 0) {
  console.log('すべて登録済みです。');
  console.log('DNSの向き先が正しいかは `npm run check-redirects` で確認してください。');
  process.exit(0);
}

if (!apply) {
  console.log('これから追加するドメイン（下見のみ。まだ何も変更していません）:');
  for (const name of missing) console.log(`  - ${name}`);
  console.log('\n実際に追加するには --apply を付けて再実行してください。');
  process.exit(0);
}

let failed = 0;
for (const name of missing) {
  const { ok, status, body } = await addDomain(name);
  if (ok) {
    console.log(`追加  ${name}`);
    // 検証用レコードが要るドメインだけAPIが返してくる。
    // DNSの値はVercelの応答をそのまま出す（固定値を書くと追従できないため）。
    for (const v of body.verification ?? []) {
      console.log(`      要設定: ${v.type} ${v.domain} → ${v.value}`);
    }
  } else {
    failed++;
    const reason = body?.error?.message ?? JSON.stringify(body);
    console.log(`失敗  ${name}  (HTTP ${status}) ${reason}`);
  }
}

console.log(`\n${missing.length - failed} / ${missing.length} 件を追加しました。`);
console.log('各ドメインのDNSをVercelへ向けたあと、`npm run check-redirects` で301を確認してください。');

if (failed > 0) process.exit(1);
