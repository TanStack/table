// Formats a vitest `json-summary` coverage report as GitHub-flavored markdown
// for the Actions step summary. Report-only: no thresholds are enforced.
//
// Usage: node scripts/coverage-summary.mjs <path-to-coverage-summary.json> [title]

import fs from 'node:fs'
import path from 'node:path'

const [, , summaryPath, title = 'Coverage Report'] = process.argv

if (!summaryPath || !fs.existsSync(summaryPath)) {
  console.error(`coverage summary not found at: ${summaryPath}`)
  process.exit(1)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))

const pct = (metric) => `${metric.pct}% (${metric.covered}/${metric.total})`

const row = (label, entry) =>
  `| ${label} | ${pct(entry.statements)} | ${pct(entry.branches)} | ${pct(entry.functions)} | ${pct(entry.lines)} |`

// Aggregate per-file entries into per-directory groups under src/
// (e.g. `core/rows`, `features/row-sorting`, `fns`).
const groups = new Map()

for (const [filePath, entry] of Object.entries(summary)) {
  if (filePath === 'total') continue

  const srcIndex = filePath.lastIndexOf(`${path.sep}src${path.sep}`)
  const relative =
    srcIndex === -1
      ? path.basename(filePath)
      : filePath.slice(srcIndex + `${path.sep}src${path.sep}`.length)
  const segments = relative.split(path.sep)
  const group =
    segments.length > 2
      ? segments.slice(0, 2).join('/')
      : segments.length === 2
        ? segments[0]
        : '(root)'

  let acc = groups.get(group)
  if (!acc) {
    acc = {
      statements: { covered: 0, total: 0 },
      branches: { covered: 0, total: 0 },
      functions: { covered: 0, total: 0 },
      lines: { covered: 0, total: 0 },
    }
    groups.set(group, acc)
  }
  for (const metric of ['statements', 'branches', 'functions', 'lines']) {
    acc[metric].covered += entry[metric].covered
    acc[metric].total += entry[metric].total
  }
}

const withPct = (acc) => {
  const result = {}
  for (const metric of ['statements', 'branches', 'functions', 'lines']) {
    const { covered, total } = acc[metric]
    result[metric] = {
      covered,
      total,
      pct: total === 0 ? 100 : Math.round((covered / total) * 10000) / 100,
    }
  }
  return result
}

const lines = [
  `## ${title}`,
  '',
  '| | Statements | Branches | Functions | Lines |',
  '| --- | --- | --- | --- | --- |',
  row('**Total**', summary.total),
  '',
  '<details><summary>Per-directory breakdown</summary>',
  '',
  '| Directory | Statements | Branches | Functions | Lines |',
  '| --- | --- | --- | --- | --- |',
  ...[...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, acc]) => row(`\`${group}\``, withPct(acc))),
  '',
  '</details>',
]

console.log(lines.join('\n'))
