#!/usr/bin/env node
/**
 * 라우트별 First Load JS 예산 검사 (Pages Router)
 *
 * Next 16부터 `next build` 출력에서 번들 사이즈 표가 사라져서,
 * `.next/build-manifest.json`과 실제 청크 파일로 직접 계산한다.
 *
 * First Load JS = (_app 청크 ∪ 라우트 청크) 의 gzip 합계
 * - polyfills 청크는 nomodule로 로드돼 모던 브라우저는 받지 않으므로 제외한다.
 * - CSS는 JS 예산과 성격이 달라 별도 집계만 하고 예산에는 넣지 않는다.
 *
 * 사용법:
 *   node .github/scripts/bundle-budget.js measure          # 현재 값 출력
 *   node .github/scripts/bundle-budget.js check            # 예산 검사 (초과 시 exit 1)
 *   node .github/scripts/bundle-budget.js check --out c.md # PR 코멘트용 마크다운 저장
 *   node .github/scripts/bundle-budget.js update           # 예산 파일을 현재 값으로 갱신
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, '.next');
const BUDGET_FILE = path.join(ROOT, '.github', 'bundle-budget.json');

// zlib 버전에 따라 결과가 흔들리지 않도록 압축 레벨을 고정한다
const GZIP_OPTIONS = { level: 9 };

const LOCAL_ONLY_ROUTE = /^\/_debug-/;

const toKb = (bytes) => Math.round((bytes / 1024) * 10) / 10;
const fmt = (kb) => `${kb.toFixed(1)} kB`;
const signed = (kb) => `${kb > 0 ? '+' : ''}${kb.toFixed(1)} kB`;

function readManifest() {
  const file = path.join(NEXT_DIR, 'build-manifest.json');
  if (!fs.existsSync(file)) {
    console.error('build-manifest.json이 없습니다. `npm run build`를 먼저 실행하세요.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const gzipCache = new Map();
function gzipSize(file) {
  if (!gzipCache.has(file)) {
    const buf = fs.readFileSync(path.join(NEXT_DIR, file));
    gzipCache.set(file, zlib.gzipSync(buf, GZIP_OPTIONS).length);
  }
  return gzipCache.get(file);
}

function measure() {
  const manifest = readManifest();
  const isJs = (f) => f.endsWith('.js');
  const appFiles = (manifest.pages['/_app'] || []).filter(isJs);
  const routeNames = Object.keys(manifest.pages).filter((r) => r !== '/_app' && !LOCAL_ONLY_ROUTE.test(r));

  // 모든 라우트가 공통으로 받는 청크
  let shared = new Set(appFiles);
  for (const route of routeNames) {
    const files = new Set(manifest.pages[route].filter(isJs));
    shared = new Set([...shared].filter((f) => files.has(f) || appFiles.includes(f)));
  }

  const routes = {};
  for (const route of routeNames) {
    const files = new Set([...appFiles, ...manifest.pages[route].filter(isJs)]);
    routes[route] = toKb([...files].reduce((sum, f) => sum + gzipSize(f), 0));
  }

  return {
    shared: toKb([...shared].reduce((sum, f) => sum + gzipSize(f), 0)),
    sharedChunks: [...shared]
      .map((f) => ({ file: f.replace('static/chunks/', ''), kb: toKb(gzipSize(f)) }))
      .sort((a, b) => b.kb - a.kb),
    routes,
  };
}

function loadBudget() {
  if (!fs.existsSync(BUDGET_FILE)) {
    console.error(`예산 파일이 없습니다: ${BUDGET_FILE}\n\`update\` 명령으로 먼저 생성하세요.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));
}

function sortedRoutes(routes) {
  return Object.entries(routes).sort((a, b) => b[1] - a[1]);
}

function printMeasure(result) {
  console.log('Route'.padEnd(42) + 'First Load JS'.padStart(14));
  console.log('-'.repeat(56));
  for (const [route, kb] of sortedRoutes(result.routes)) {
    console.log(route.padEnd(42) + fmt(kb).padStart(14));
  }
  console.log('-'.repeat(56));
  console.log('전 라우트 공유'.padEnd(38) + fmt(result.shared).padStart(14));
  for (const chunk of result.sharedChunks) {
    console.log('  ' + chunk.file.padEnd(46) + fmt(chunk.kb).padStart(12));
  }
}

function check(outFile) {
  const budget = loadBudget();
  const current = measure();
  const tolerance = budget.toleranceKb;

  const violations = [];
  const rows = [];

  const sharedDelta = current.shared - budget.shared;
  if (sharedDelta > tolerance) {
    violations.push(
      `공유 청크가 예산을 초과했습니다: ${fmt(current.shared)} (기준 ${fmt(budget.shared)}, ${signed(sharedDelta)})`,
    );
  }

  for (const [route, kb] of sortedRoutes(current.routes)) {
    const baseline = budget.routes[route];
    if (baseline === undefined) {
      // 새 라우트는 기준값이 없으므로 신규 라우트 상한으로 검사한다
      const over = kb > budget.newRouteMaxKb;
      if (over) {
        violations.push(
          `신규 라우트 \`${route}\`가 상한을 초과했습니다: ${fmt(kb)} (상한 ${fmt(budget.newRouteMaxKb)})`,
        );
      }
      rows.push({ route, kb, delta: null, status: over ? '초과' : '신규' });
      continue;
    }
    const delta = kb - baseline;
    const over = delta > tolerance;
    if (over) {
      violations.push(`\`${route}\`가 예산을 초과했습니다: ${fmt(kb)} (기준 ${fmt(baseline)}, ${signed(delta)})`);
    }
    rows.push({ route, kb, delta, status: over ? '초과' : null });
  }

  const removed = Object.keys(budget.routes).filter((r) => current.routes[r] === undefined);

  // 콘솔 출력
  const changed = rows.filter((r) => r.delta === null || Math.abs(r.delta) >= 0.1);
  if (changed.length === 0) {
    console.log('번들 사이즈 변화 없음.');
  } else {
    console.log('변화가 있는 라우트:');
    for (const r of changed) {
      const delta = r.delta === null ? '(신규)' : signed(r.delta);
      console.log(`  ${r.route.padEnd(40)} ${fmt(r.kb).padStart(11)}  ${delta}`);
    }
  }
  if (Math.abs(sharedDelta) >= 0.1) {
    console.log(`\n공유 청크: ${fmt(current.shared)} (${signed(sharedDelta)})`);
  }
  for (const route of removed) {
    console.log(`알림: \`${route}\`가 사라졌습니다. 의도한 변경이면 예산 파일을 갱신하세요.`);
  }

  if (outFile) {
    fs.writeFileSync(outFile, buildMarkdown({ current, budget, rows, sharedDelta, violations, removed }));
  }

  if (violations.length > 0) {
    console.error(`\n번들 예산 초과 ${violations.length}건:`);
    for (const v of violations) console.error(`  - ${v.replace(/`/g, '')}`);
    console.error(
      `\n허용 오차는 라우트당 ${fmt(tolerance)}입니다.` +
        '\n의도한 증가라면 `node .github/scripts/bundle-budget.js update`로 예산을 갱신하고 PR에 사유를 적어주세요.',
    );
    process.exit(1);
  }

  console.log('\n번들 예산을 모두 통과했습니다.');
}

function buildMarkdown({ current, budget, rows, sharedDelta, violations, removed }) {
  const lines = [];
  lines.push('<!-- bundle-budget -->');
  lines.push('## 번들 사이즈 예산');
  lines.push('');

  if (violations.length > 0) {
    lines.push(`**예산 초과 ${violations.length}건**`);
    lines.push('');
    for (const v of violations) lines.push(`- ${v}`);
  } else {
    lines.push('예산을 모두 통과했습니다.');
  }
  lines.push('');
  lines.push(
    `공유 청크 **${fmt(current.shared)}** (기준 ${fmt(budget.shared)}, ${signed(sharedDelta)}) · ` +
      `허용 오차 라우트당 ${fmt(budget.toleranceKb)}`,
  );
  lines.push('');

  const changed = rows.filter((r) => r.delta === null || Math.abs(r.delta) >= 0.1);
  if (changed.length > 0) {
    lines.push('### 변화가 있는 라우트');
    lines.push('');
    lines.push('| 라우트 | First Load JS | 변화 |');
    lines.push('|---|---:|---:|');
    for (const r of changed) {
      const delta = r.delta === null ? '신규' : signed(r.delta);
      const mark = r.status === '초과' ? ' ⚠️' : '';
      lines.push(`| \`${r.route}\` | ${fmt(r.kb)} | ${delta}${mark} |`);
    }
    lines.push('');
  }

  for (const route of removed) {
    lines.push(`- \`${route}\`가 사라졌습니다. 의도한 변경이면 예산 파일을 갱신해주세요.`);
  }

  lines.push('<details><summary>전체 라우트</summary>');
  lines.push('');
  lines.push('| 라우트 | First Load JS |');
  lines.push('|---|---:|');
  for (const r of rows) lines.push(`| \`${r.route}\` | ${fmt(r.kb)} |`);
  lines.push('');
  lines.push('</details>');
  lines.push('');
  lines.push('<sub>gzip 기준, polyfills(nomodule) 제외.</sub>');

  return lines.join('\n') + '\n';
}

function update() {
  const current = measure();
  const existing = fs.existsSync(BUDGET_FILE) ? JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8')) : {};
  const budget = {
    toleranceKb: existing.toleranceKb ?? 3,
    newRouteMaxKb: existing.newRouteMaxKb ?? Math.ceil(Math.max(...Object.values(current.routes)) + 10),
    shared: current.shared,
    routes: Object.fromEntries(
      Object.keys(current.routes)
        .sort()
        .map((r) => [r, current.routes[r]]),
    ),
  };
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2) + '\n');
  console.log(`예산 파일을 갱신했습니다: ${path.relative(ROOT, BUDGET_FILE)}`);
  console.log(`  공유 청크 ${fmt(budget.shared)} · 라우트 ${Object.keys(budget.routes).length}개`);
}

const [command, ...rest] = process.argv.slice(2);
const outIndex = rest.indexOf('--out');
const outFile = outIndex >= 0 ? rest[outIndex + 1] : null;

switch (command) {
  case 'measure':
    printMeasure(measure());
    break;
  case 'check':
    check(outFile);
    break;
  case 'update':
    update();
    break;
  default:
    console.error('사용법: bundle-budget.js <measure|check|update> [--out <file>]');
    process.exit(1);
}
