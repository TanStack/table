---
name: fuzzy-ranking
description: >
  Rank fuzzy matches with rankItem, filter with RankingInfo.passed, compare saved ranking metadata with compareItems, and configure rankings, thresholds, accessors, min/max bounds, or diacritics. Load for @tanstack/match-sorter-utils itself or fuzzy Table filterMeta wiring.
metadata:
  type: core
  library: '@tanstack/match-sorter-utils'
  library_version: '9.0.1'
sources:
  - 'TanStack/table:packages/match-sorter-utils/src/index.ts'
  - 'TanStack/table:docs/framework/react/guide/fuzzy-filtering.md'
  - 'TanStack/table:examples/react/filters-fuzzy'
---

## Setup

<!-- skill-snippet:check -->

```ts
import { compareItems, rankItem, rankings } from '@tanstack/match-sorter-utils'

const query = 'tan'
const values = ['table', 'tanner', 'router']
export const ranked = values
  .map((value) => ({
    value,
    info: rankItem(value, query, { threshold: rankings.MATCHES }),
  }))
  .filter((entry) => entry.info.passed)
  .sort((a, b) => compareItems(a.info, b.info))
```

## Core Patterns

### Separate ranking, filtering, and sorting

Call `rankItem` once, filter on `info.passed`, retain the `RankingInfo`, then order matching results with `compareItems`.

### Rank object fields through accessors

```ts
type Person = { name: string; email: string }
const person: Person = { name: 'Ada Lovelace', email: 'ada@example.test' }
const info = rankItem(person, 'lov', {
  accessors: [(item) => item.name, (item) => item.email],
})
```

Accessor options can set a per-accessor threshold plus minRanking/maxRanking bounds.

### Store ranking as Table filter metadata

In a Table filterFn, call `addMeta?.({ itemRank })`. Register the corresponding
meta shape with `filterMeta: metaHelper<{ itemRank: RankingInfo }>()`. A related
sortFn reads `row.columnFiltersMeta[columnId]?.itemRank` and uses `compareItems`,
falling back to an ordinary comparator for ties or absent metadata. For the
primary Table composition, load `@tanstack/table-core#global-filtering` and
register the fuzzy filter under `filterFns` for `globalFilterFn: 'fuzzy'`.

## Common Mistakes

### HIGH Numeric rank used as pass flag

Wrong: `if (rankItem(value, query).rank) include(value)`.

Correct: test `rankItem(value, query).passed`.

Ranks below the configured threshold can still be nonzero; `passed` records the threshold decision.

Source: TanStack/table:packages/match-sorter-utils/src/index.ts

### HIGH Ranking recomputed during sorting

Wrong: call `rankItem` for both rows on every comparator invocation.

Correct: retain RankingInfo during filtering and pass the stored values to `compareItems`.

Sorting is called many times; recomputing also risks using different query/options than the filter decision.

Source: TanStack/table:docs/framework/react/guide/fuzzy-filtering.md

### MEDIUM compareItems direction reversed twice

Wrong: negate `compareItems(a, b)` because a larger rank should appear first.

Correct: use `compareItems(a, b)` directly for ascending fuzzy relevance.

The function already returns -1 when `a.rank` is greater than `b.rank`.

Source: TanStack/table:packages/match-sorter-utils/src/index.ts

## API Discovery

Inspect `node_modules/@tanstack/match-sorter-utils/dist/index.d.ts` for the installed `RankItemOptions`, accessor attributes, ranking constants, and comparator behavior. For TanStack Table metadata integration, load the global-filtering and sorting skills.
