# `@tanstack/table-core` — Aggregation Refactor Performance Deep Dive

2026-07-16. Follow-up to `perf-done.md`. Investigates the grouping/aggregation
regression introduced by the `rowAggregationFeature` refactor
(beta.46 → beta.51) and documents the fixes that landed from this deep dive.

## Symptom

The row-model benchmark (`benchmark-examples`, single-level `grouping: ['group']`,
one aggregated column, 20 groups) regressed on every grouping scenario:

- vs **beta.46** (pre-refactor): all 27 meaningful grouping measurements regressed
  > 5%; median raw regression **81%** (browser report
  > `row-model-2026-07-16T12-54-16.147Z.html`).
- vs **v8**: every 400k aggregation scenario flipped from faster to **6–30% slower**.
- Everything outside grouping was roughly unchanged, so the cause was isolated
  to the new aggregation execution path.

## Reproduction harness

Browser runs are the ground truth but slow to iterate. Three Node scripts were
added under `benchmark-examples/scripts/` that import a repo's built
`table-core` dist directly and replicate the benchmark stage (grouped model
build + one aggregated `getValue` per group row):

```bash
# per-scenario timings (fresh process per scenario; each sample builds a fresh table)
SCENARIO=sum node --expose-gc --max-old-space-size=10240 scripts/agg-diagnose.mjs ../table 400000 5

# 2-level grouping value-checksum + timing comparison (exercises the merge path)
node --expose-gc scripts/agg-multilevel-check.mjs ../table 100000

# per-table heap retention
node --expose-gc scripts/agg-leak-check.mjs ../table 200000
```

The harness reproduced the browser regression at matching magnitude
(+52%…+92% per scenario at 400k) with identical aggregate values, and a
`--cpu-prof` profile gave exact attribution.

Caveat: dist builds keep `process.env.NODE_ENV` checks that app bundlers
strip in production, and env reads are expensive in Node, so
`table_getColumn`-adjacent costs are somewhat overstated relative to a
production browser bundle. All comparisons here are same-harness, so relative
deltas hold.

## Root causes (profile-confirmed)

CPU profile of beta.51 `sum` @ 400k (whole process, 5 samples + 2 warmups):
`visit` (row normalization) **23.8%** self, GC **18.9%**, `table_getColumn`
**12.3%**, memo machinery ~8%.

### R1. Per-column frontier normalization re-walks every row through a `Set<string>`

`aggregateColumnValue` called `normalizeAggregationRows(rows, maxDepth)` on
every aggregated `getValue` of every group row. With the default
`maxAggregationDepth: 0` the "frontier" is just the group's own rows — but the
function still allocated a result array plus a `Set`, and paid
`seen.has(row.id)`/`seen.add(row.id)` string hashing for **every row in every
group** (O(total rows) per aggregated column). beta.46 iterated the group's
rows directly with zero preprocessing.

### R2. `leafRows` construction pays the same normalization again

`createGroupedRowModel` computed
`leafRows = normalizeAggregationRows(groupedRows, Infinity)` for every group —
a second O(total rows) `Set<string>` pass per model build. beta.46 aliased
`leafRows = groupedRows` at depth 0 (free) and only flattened for nested
levels.

R1 + R2 explain the near-constant ~230–245ms added at 400k across _all_
scenarios — most visible for `count` (+153% in the browser), whose actual
aggregation work is `rows.length`, i.e. O(1).

### R3. `min`/`max`/`extent` collect-then-compare with `instanceof`-heavy comparator

The rewritten range fns first materialized an O(n) values array
(`collectRangeValues`), then reduced it with `compareRangeValues`, which
performs two `instanceof Date` checks per comparison. beta.46 did one
typeof-guarded pass with no intermediate array. This is the extra ~140ms that
made `min` the worst scenario (browser: +136% vs beta.46, +29% vs v8).

### R4. Eager `_aggregationValuesCache` object on every data row

`rowAggregationFeature.initRowInstanceData` allocated a `makeObjectMap()` on
**every row** at core-row-model build, though only synthetic group rows ever
store aggregates — and the grouped model already creates the cache lazily with
`??=`. At 200k rows this added ~40MB retained heap per table (measured
193MB/table vs 152MB on beta.46) and extra GC scanning during the measured
stage.

### R5 (pre-existing, both builds). Per-row memoized `table.getColumn` in `groupBy`

`groupBy` resolved the grouping column through
`row_getGroupingValue → row.table.getColumn(columnId)` for every row — a
memoized-API dispatch (deps-array allocation + compare) per row, ~12% of the
profile. Not part of the regression, but fixing it is what pushes v9 past its
old baseline.

## Fixes implemented

All in `packages/table-core`; behavior gates: full unit/implementation suite
(1000 tests), `test:types` (incl. declaration emit), size-limit
(19.27 kB / 20 kB) all pass.

1. **`normalizeUniqueAggregationRows`**
   (`rowAggregationFeature.utils.ts`) — frontier selection for rows that are
   distinct nodes of a single row tree (everything the table's own row models
   produce). Skips the duplicate-id `Set` (disjoint subtrees can't revisit a
   row) and returns the input array unchanged when nothing descends, so the
   default `maxDepth: 0` case is a zero-cost alias. The public
   `normalizeAggregationRows` keeps its dedupe semantics for caller-supplied
   row arrays.

2. **`aggregateColumnValue({ uniqueRows })`** — the grouped row model and the
   default-model path of `column_getAggregationValue` pass `uniqueRows: true`
   and route through the fast variant; explicit `getAggregationValue({ rows })`
   calls still dedupe. Also hoisted the shared `getValue` closure out of the
   per-entry `execute`.

3. **`createGroupedRowModel`** — `leafRows` now uses
   `normalizeUniqueAggregationRows(groupedRows, Infinity)` (identity for flat
   groups, `Set`-free flatten for nested ones), and `groupBy` resolves the
   grouping column **once per level** instead of per row, mirroring
   `row_getGroupingValue`'s caching contract branch-for-branch.

4. **Single-pass `min`/`max`/`extent`** (`aggregationFns.ts`) — no intermediate
   values array; the running best is tracked alongside its numeric
   representation so `Date` columns compare by cached `getTime()` and numeric
   columns never see `instanceof`. NaN seeding and first-valid-kind selection
   preserved exactly. Other fns hoist `context.rows` out of loop headers.

5. **Removed `initRowInstanceData`** from `rowAggregationFeature`;
   `Row_RowAggregation._aggregationValuesCache` is now optional and created
   lazily on grouped rows only.

### Behavioral notes

- Rows fed by the table's own grouped model no longer collapse duplicate row
  IDs (only possible with a colliding `getRowId`) during aggregation — this
  matches v8 and beta.46. Caller-supplied rows keep the documented dedupe.
- For an all-flat group, `row.leafRows` is the internal partition array itself
  (same aliasing beta.46 had at depth 0).
- Aggregate results are unchanged: single-level checksums and 2-level
  merge-path checksums are identical to beta.46 across all scenarios.

## Results (Node harness medians)

### Single level, 400k rows, 20 groups

| Scenario    | beta.46 | beta.51 | fixed | vs beta.51 | vs beta.46 |
| ----------- | ------: | ------: | ----: | ---------: | ---------: |
| sum         |   552.9 |   893.0 | 388.9 |       −56% |   **−30%** |
| min         |   578.2 |   974.1 | 412.9 |       −58% |   **−29%** |
| max         |   532.5 |  1021.8 | 409.4 |       −60% |   **−23%** |
| extent      |   598.0 |   916.6 | 417.6 |       −54% |   **−30%** |
| mean        |   511.4 |   918.8 | 388.4 |       −58% |   **−24%** |
| median      |   597.0 |  1015.3 | 486.0 |       −52% |   **−19%** |
| unique      |   519.6 |   791.4 | 387.3 |       −51% |   **−25%** |
| uniqueCount |   518.1 |   828.8 | 372.3 |       −55% |   **−28%** |
| count       |   310.5 |   565.6 | 200.8 |       −64% |   **−35%** |

### Other sizes (fixed vs beta.46)

| Scenario |                 20k |                100k |
| -------- | ------------------: | ------------------: |
| sum      | 11.8 vs 14.0 (−16%) | 83.8 vs 96.0 (−13%) |
| min      | 11.4 vs 14.3 (−20%) |  90.6 vs 96.5 (−6%) |
| count    |   6.6 vs 8.8 (−25%) | 40.4 vs 52.1 (−22%) |

### Two-level grouping (merge path), 100k rows — not covered by the browser suite

| Scenario    | beta.46 | fixed |    Δ |
| ----------- | ------: | ----: | ---: |
| sum         |   168.1 | 102.5 | −39% |
| min         |   180.2 | 105.6 | −41% |
| max         |   171.4 | 121.7 | −29% |
| extent      |   210.8 | 120.9 | −43% |
| mean        |   205.9 | 131.4 | −36% |
| count       |   140.4 |  75.4 | −46% |
| uniqueCount |   168.0 | 122.3 | −27% |

Value checksums identical to beta.46 in every row above.

### Memory

Retained heap per constructed 200k-row table: beta.51 ~193MB → fixed ~152MB
(= beta.46). Post-fix profile: `visit` no longer appears; remaining top costs
are GC (core-model construction churn), `row_getValue` cache-miss column
resolution, and the real aggregation loops.

The browser benchmark should be re-run to confirm, but given the Node harness
tracked the browser numbers closely on the way down, the expectation is v9
returns to a comfortable lead over v8 at 400k (beta.51 was 6–30% behind; the
fixed build is 52–64% faster than beta.51 on these scenarios).

## Remaining opportunities (not done here)

1. **Per-miss `table.getColumn` dispatch in `row_getValue` / `row_getUniqueValues`**
   (`coreRowsFeature.utils.ts`) — each first read of a (row, column) pays a
   memoized-API dispatch (~12–16% of the profiled run even after the groupBy
   hoist, though partly a Node/`process.env` artifact). A cheaper internal
   column-record lookup would benefit every row model, not just grouping.
2. **Table instances are never released** — sequentially constructing tables
   retains ~150MB per 200k-row table after full GC on _both_ beta.46 and
   beta.51 (pre-existing; likely reactivity subscriptions rooting the table).
   Long-lived apps that rebuild tables (or state resets that reconstruct)
   would accumulate. Deserves its own investigation.
3. **Eager `_groupingValuesCache` per row** (`columnGroupingFeature.ts:83`) —
   same shape as R4, pre-existing on both builds; only rows grouped by a
   column with `getGroupingValue` ever use it. Removing the eager init
   requires keeping `row_getGroupingValue`'s write-guard semantics in mind.
4. **Benchmark gap:** the browser suite has no multi-level grouping scenario,
   so the merge path (`definition.merge` + `subRowResults`) is untested there.
   `agg-multilevel-check.mjs` covers it in Node; a two- or three-level browser
   scenario would make regressions in that path visible in the standard report.
5. `median` remains the slowest scenario (sort-based); a selection algorithm
   (quickselect) would cut it further if it ever matters.
