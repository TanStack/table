# `@tanstack/table-core` — Performance Refactor Catalog: New (2026-07-03 benchmark round)

Findings derived from the v8↔v9 row-model benchmark run
`benchmark-examples/results/row-model-2026-07-03T15-30-46.270Z.{json,html}`
(5 iterations, 0 warmups, `stage` pipeline, flat + tree data at 1k / 20k / 100k / 400k rows).

Entries here are NOT yet in `perf-done.md` / `perf-todo.md` / `perf-skipped.md`. Section 3
records benchmark-evidence updates to existing catalog entries (no new findings there, but
the measurements change their priority).

## Counts

- **New entries:** 5 (N1–N3 core, N4–N5 benchmark harness)
- **Evidence updates to existing entries:** 2 (#102/C9, #78/B9+E14)

---

## 1. Benchmark context: where the wins came from

Median v9-vs-v8 deltas by row model (400k rows, stage pipeline), with the completed catalog
entries most responsible:

| Row model / scenario                         | v8 → v9 (400k)               | Delta                           | Primary attribution (perf-done)                                                                                                      |
| -------------------------------------------- | ---------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| core                                         | 406.5 → 113.1 ms             | −72%                            | v9 prototype-row architecture (shared row prototype vs ~20 per-row closures in v8 `createRow`), `for…of`→indexed sweep, #1 memo loop |
| grouping (count … median)                    | 280–545 → 117–287 ms         | −47–58%                         | #133/E9 aggregation-fn rewrites, #57 median quickselect, #58 unique/uniqueCount, prototype-based group-row construction              |
| sorting alphanumeric(CS)                     | 1602–2026 → 726–792 ms       | −55–61%                         | #49 sort clone removal, #64/E2 allocation-free `compareAlphanumeric`, #61 auto-sortFn fix, #88/B8 resolvedSorting                    |
| sorting datetime                             | 672–724 → 330–334 ms         | −51–54%                         | #49 + #53                                                                                                                            |
| sorting basic / textCaseSensitive            | ~1100/1300 → ~765/1000 ms    | −24–39%                         | #49 (clone removal is the only large lever; comparator already trivial)                                                              |
| **sorting text**                             | **1311–1392 → 1187–1343 ms** | **−2.5% … +15% (parity/noise)** | none effective — see §3 (#78) and N2                                                                                                 |
| filtering (9 fns)                            | 107–128 → 59–82 ms           | −35–45%                         | #73/E1, #95/E6, #136/E15 resolveFilterValue hoists; #54/E5, #55/E7 loop/alloc fixes                                                  |
| faceting scoreMinMax                         | 129.3 → 36.7 ms              | −72%                            | loop-fusion sweep pattern 2 (fused min/max scan, subsumed #21)                                                                       |
| faceting status/alphanumericUnique           | 93–118 → 68–91 ms            | −23–27%                         | #22 (Map.has removal); remainder is inherent Map get/set over R rows                                                                 |
| expanding allExpanded (tree)                 | 20.6 → 5.6 ms                | −73%                            | loop hygiene in `expandRows` walk (B15 headroom still open)                                                                          |
| selection selectedCore1Percent               | 24.9 → 10.5 ms               | −58%                            | #47 memoized selection getters + `getSelectedRowIds`, #48, loop-fusion pattern 4                                                     |
| selection filteredSelected / groupedSelected | —                            | **invalid**                     | #102/C9 bug — see §3; do not cite these numbers                                                                                      |

Checksums matched v8 for **every scenario except `selection:groupedSelected10Percent`**,
where v9 returned an **empty row model at all four row counts** (v8: 10 group rows). That is
the confirmed #102/C9 bug, not a win — the reported "−90%" there is the cost of doing no work.

Regression scan: all other negative deltas in the run (`includesStringSensitive` @1k −200%,
`statusFacetedRowsWithTextFilter` @20k −50%, `sorting basic` @1k −17%, etc.) are sub-millisecond
medians under `warmups: 0` — measurement noise (see N5). The two real non-wins are
`filteredSelected10Percent` @20k (−50%, explained by C9: v9 walks 20k core rows where v8 walks
6.7k filtered rows) and `sorting text` at parity (see N2 / #78).

---

## 2. New findings

## N1. Grouped row model pushes every terminal-depth leaf row into `flatRows`/`rowsById` twice — Score: 6 (inherited v8 bug)

**Status:** `[x]` done
**Implementation note:** Fixed 2026-07-03 with the exactly-once push scheme described below: the
terminal-branch push (:86–87) was removed and replaced with a post-recursion push of the
reassigned `row.subRows` (covers descendants below terminal depth); the parent-group and root
loops are unchanged, so every row is pushed by its parent (or the root loop) exactly once.
Design review verified the scheme for single/multi-level grouping, flat and tree data, undefined
grouping values, AND a bonus instance the original finding missed: grouping on only-nonexistent
column ids (`existingGrouping.length === 0` after filtering) reached the terminal branch at depth
0 and double-pushed every top-level row — fixed for free by the same scheme. Two accepted deltas:
(a) tree-data rows below terminal depth move from preorder to postorder in grouped flatRows (no
in-repo consumer reads that order; the sorted model already emits postorder), and (b)
`getExpandedRowModel().flatRows.length` roughly halves when grouping is active (expandRows
forwards grouped flatRows by reference) — correct, flagged for the release note. Regression
coverage in `tests/implementation/features/column-grouping/createGroupedRowModel.test.ts`
(single-level flat 12→7, two-level flat 13→9, tree-below-terminal 18→16, undefined grouping
values 8→5, nonexistent-column grouping 6→3 flatRows; all with duplicate-id checks). The
benchmark comparison layer gained a known-delta allowlist annotating the intentional v8↔v9
`outputFlatRows` mismatch for grouping scenarios.
**Location:** `packages/table-core/src/features/column-grouping/createGroupedRowModel.ts:86–87` (terminal-branch push) and `:179–182` (parent group's subRows push); v8 has the identical double-push in `table-v8/packages/table-core/src/utils/getGroupedRowModel.ts`
**Category:** `bug`, `allocation`, `big-o`

**Benchmark evidence:** for R=400,000 flat rows grouped into 20 groups, `outputFlatRowsMedian`
is **800,020** (= 20 group rows + 2 × 400,000 leaves) in BOTH v8 and v9. Checksums still match
because `rows` (the tree) is correct; only `flatRows`/`rowsById` writes are duplicated
(`rowsById` writes are idempotent, so it hides the bug).

**What happens:** rows at `depth === existingGrouping.length` are pushed once by the terminal
branch (`groupedFlatRows.push(row)` at :86) and pushed AGAIN by their parent group's
`subRows.forEach((subRow) => { groupedFlatRows.push(subRow); … })` loop at :179–182. Rows
deeper than the terminal depth (tree data under leaves) are pushed only by :86; group rows are
pushed only by :179/:193. Net: every direct child of a group appears twice in `flatRows`, and
`rowsById` performs R redundant keyed writes.

**v8 → v9 delta:** none — v9 faithfully ported the v8 behavior (parity requirement). This is
the first benchmark that counted `flatRows`, which is how it surfaced.

**Cost:** R extra array pushes + R redundant `rowsById` writes per grouped rebuild; a
2R-length `flatRows` array retained for the model's lifetime (~3.2 MB of refs at R=400k);
every downstream consumer that walks grouped/expanded/paginated `flatRows`
(`getExpandedDepth`, pre-paginated flatRows memoDeps, user code) does 2× work. The expanded
and paginated models pass the grouped `flatRows` through, so the duplication propagates down
the pipeline.

**Fix sketch (exactly-once push scheme):** every level's rows are pushed by their _parent_:
root rows by the existing `:193–196` loop, group children by the existing `:179–182` loop, and
descendants below the terminal depth by a new push inside the terminal branch after the
`row.subRows = groupUpRecursively(...)` recursion. Delete the unconditional push at `:86–87`.

```ts
// terminal branch
if (depth >= existingGrouping.length) {
  return rows.map((row) => {
    row.depth = depth
    // (delete the groupedFlatRows.push(row) / groupedRowsById[row.id] = row here)

    if (row.subRows.length) {
      row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id)
      for (let i = 0; i < row.subRows.length; i++) {
        const subRow = row.subRows[i]!
        groupedFlatRows.push(subRow)
        groupedRowsById[subRow.id] = subRow
      }
    }
    return row
  })
}
```

**Big-O:** grouped rebuild sheds R pushes + R keyed writes; `flatRows` length drops from
~2R to R+G. All downstream `flatRows` walks halve.

**Risk:** Public behavior change — `getGroupedRowModel().flatRows.length` halves, and
flatRows ordering shifts from "child-before-parent duplicates" to exactly-once. This is v8
parity-breaking in the same class as #102/C9's fix (v8's own output here is plainly
unintended: `flatRows` is documented as "a flattened array of all rows", not a multiset).
Land with a changelog note; update the benchmark checksum expectations. `rowsById` is
unaffected (same key set).

---

## N2. Non-memoized prototype-API wrapper allocates a rest array + spread call on the hottest getters (`row.getValue`, `row.getUniqueValues`, `cell.getValue`) — Score: 5

**Status:** `[ ]` not started
**Location:** `packages/table-core/src/utils.ts:449–451` (`prototype[fnKey] = function (this, ...args) { return fn(this, ...args) }`)
**Category:** `allocation`, `micro`, `render-path`

Promotes the sub-note inside todo #81/D6 ("non-memoized variant … scored separately at 4
pending arity audit") to a standalone entry, with new benchmark evidence and a concrete fix.

**v8 → v9 architecture delta:** v8 assigned every row API as a per-row closure inside
`createRow` (`table-v8/src/core/row.ts:112` — `getValue: (columnId) => {…}`): expensive at
construction (the main reason v8's core model is 3.5× slower to build), free at call time.
v9 moved APIs to a shared row prototype: construction became cheap (the measured −72% core
win), but every call now routes through a generic wrapper that collects `...args` into a
fresh array and spread-calls the static fn. The cost moved from build time to call time.

**Benchmark evidence:** sorting is the workload where call-time dominates. With the default
`sortUndefined: 1` (`rowSortingFeature.ts:39`), each comparison performs 4 `row.getValue`
calls (2 in the comparator's sortUndefined pre-check at `createSortedRowModel.ts:97–98`,
2 inside the sortFn). A 400k-row sort ≈ 7.4M comparisons ≈ **~30M wrapper invocations, each
allocating a 1-element rest array**, plus the same again for `charCodeAt`-free fns. This is
consistent with the compressed wins on comparator-cheap sorts (`basic` −24–39%,
`textCaseSensitive` −29–39%) versus construction-heavy paths (core −72%), and with
`sorting text` landing at parity (its `toLowerCase` cost is v8-equal, so only the
clone-removal win minus the new wrapper tax remains, ≈ noise). Grouped aggregation pays it
too: each aggregated column evaluates `leafRows` getValue per leaf (400k wrapper hits per
aggregation at R=400k).

**Before**

```ts
// Non-memoized methods just call the static function with `this`
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  return fn(this, ...args)
}
```

**After** (fixed-arity passthrough; static fns take at most 3 params after the instance —
verify with the one-pass arity audit #81 already calls for, then pin the max):

```ts
// Non-memoized methods just call the static function with `this`.
// Fixed arity: no rest-array allocation, no spread call. Extra `undefined`
// args are safe — no static fn inspects arguments.length (audited).
prototype[fnKey] = function (this: any, a?: any, b?: any, c?: any) {
  return fn(this, a, b, c)
}
```

(If any fn is found to branch on `arguments.length`, register an explicit `arity` in its API
definition and generate the matching wrapper instead.)

**Big-O:** No asymptotic change; removes one array allocation + spread-call frame from every
non-memoized prototype API invocation. At sort scale that is tens of millions of allocations
per rebuild; at render scale it is R_vis × N `cell.getValue`/`row.getValue` calls per pass.
Caveat: modern V8 sometimes sinks rest arrays for monomorphic call sites, so the realized win
needs a profile — but the fixed-arity form is never slower and simplifies the JIT's job.

**Cross-refs:** #81/D6 (memoized-wrapper single-arg passthrough — same file, same shape);
#126/C15 (`row_getValue` hasOwn + double keyed lookup — stacks with this on the same path);
#78/B9+E14 (sort-key precomputation removes most of these calls from the sort path entirely).

**Risk:** Very low after the arity audit. Passing explicit `undefined` for absent optional
params is observationally identical for every static fn that only ever reads its declared
parameters.

---

## N3. Sort comparator pays the `sortUndefined` double-read even when the column contains no `undefined` values — Score: 4 (interim; superseded by #78 when it lands)

**Status:** `[ ]` not started
**Location:** `packages/table-core/src/features/row-sorting/createSortedRowModel.ts:96–112`
**Category:** `big-o` (short-circuit)

With the default `sortUndefined: 1`, every comparison calls `rowA.getValue` + `rowB.getValue`
purely to test for `undefined`, then the sortFn re-reads both values (cache hits, but each is
a wrapper dispatch + `hasOwn` + keyed lookup — and see N2). For fully-populated columns (the
overwhelmingly common case; every benchmark column qualifies) this doubles the per-comparison
getValue traffic: ~2 × R log₂ R wasted reads per sort (≈15M at R=400k).

**Fix sketch:** one O(R) pre-scan per resolved sort column while building `resolvedSorting`
(or fused into the `sortedData` slice loop): if no value is `undefined`, clear the
`sortUndefined` flag on that entry so the comparator skips the branch. Scan cost O(R) versus
O(R log R) reads saved — favorable from ~1k rows up, and the values land in `_valuesCache`
anyway (the scan is effectively the cache-warming pass #78 wants).

```ts
for (let i = 0; i < availableSorting.length; i++) {
  // ...existing resolvedSorting build...
  if (entry.sortUndefined) {
    let hasUndefined = false
    for (let r = 0; r < preSortedRowModel.flatRows.length; r++) {
      if (preSortedRowModel.flatRows[r]!.getValue(entry.id) === undefined) {
        hasUndefined = true
        break
      }
    }
    if (!hasUndefined) entry.sortUndefined = false
  }
}
```

**Big-O:** per sort of a fully-populated column: 2 × R log R hashed getValue reads → R
pre-scan reads (which double as cache warming). Halves comparator getValue traffic.

**Risk:** Low. Semantics identical: when no value is `undefined`, the `sortUndefined` branch
can never produce a non-zero `sortInt` or a `continue`. Mid-sort mutation of values is already
unsupported (`_valuesCache` assumes it). **Note:** #78/B9+E14 (decorate-sort-undecorate)
subsumes this entirely — treat N3 as the cheap interim step if #78 stays design-blocked.

---

## N4. Benchmark harness: `filteredSelected10Percent` selection is a subset of the filter, so it cannot detect the C9 wrong-model bug — Score: n/a (benchmark repo)

**Status:** `[x]` done
**Implementation note:** Added `makeStraddledSelectionState(rows, modulo)` to
`shared/src/rowModelScenarios.ts` (selects `index` and `index + 1` per stride, so half the
selected rows pass the `equalsString 'single'` filter and half fail) and wired it into the
`filteredSelected` branch of both `examples/v8/selection-row-model/src/main.tsx` and
`examples/v9/selection-row-model/src/main.tsx`. Verified live against published table-core
beta.29 (bug present): the scenario now reports checksum DIFF with 34 (v8, selected ∩ filtered)
vs 68 (v9, unfiltered) output rows — the guard works. Expected to match again once the C9 fix
ships in a published version and the example dependency is bumped.
**Location:** `benchmark-examples/examples/{v8,v9}/selection-row-model/src/main.tsx` (selection state) + `benchmark-examples/shared/src/rowModelScenarios.ts:145–157`
**Category:** `benchmark-methodology`

Generated data assigns `status = statuses[index % 3]` and the scenario selects
`makeSelectionState(rows, 30)` (every 30th index). Since `index % 30 === 0 ⇒ index % 3 === 0
⇒ status === 'single'`, and the filter is `equalsString: 'single'`, **every selected row
passes the filter**. v9's `getFilteredSelectedRowModel` currently walks the CORE model
(#102/C9), yet produces byte-identical checksums here — the scenario is structurally unable
to catch it. The same run's `groupedSelected10Percent` DID catch the grouped variant
(checksum DIFF, 0 rows), which is what makes the sibling gap visible.

**Fix:** select ids straddling the filter, e.g. `state[String(index)] = true` for
`index % 30 === 0` AND `index % 30 === 1` (status `single` and `relationship`). v8 then
returns only the `single` half; a core-model walk returns both, and the checksum/row-count
comparison fails loudly. Keep the scenario until C9's fix lands with a regression test in
table-core itself. Until then, exclude both `filteredSelected*` and `groupedSelected*`
comparisons from headline win numbers (the −50% @20k "regression" and the +90% "win" are both
artifacts of C9).

---

## N5. Benchmark harness: `warmups: 0` with 5 iterations makes sub-millisecond scenarios report ±50–200% phantom deltas — Score: n/a (benchmark repo)

**Status:** `[x]` done
**Implementation note:** Default `warmups` raised 0 → 2 in `scripts/run-row-model-bench.ts`
(CLI `--warmups` still overrides; warmup samples were already excluded from results). The
comparison layer now sets `subMillisecond: true` on JSON rows where both medians are < 1 ms, and
the HTML comparison table renders those rows muted with a "sub-ms" marker instead of a colored
percent delta.
**Location:** `benchmark-examples/scripts/run-row-model-bench.ts` (options: `warmups: 0`, `iterations: 5`)
**Category:** `benchmark-methodology`

Scenarios whose medians are ≤0.6 ms (`includesStringSensitive` @1k: 0.1→0.3 ms = "−200%",
`statusFacetedRowsWithTextFilter` @20k: 0.2→0.3 ms = "−50%", `sorting basic/text` @1k,
`pagination:*`, `expanding collapsed/partialExpanded`) are dominated by first-run JIT/IC
warm-up and timer granularity, and their percent deltas flip sign between the two directions
of the same sorting scenario in this very run.

**Fix:** (a) add ≥2 warmup runs before sampling; (b) in the comparison/report layer, suppress
or visually de-emphasize percent deltas when BOTH medians are under ~1 ms (report absolute ms
instead); (c) optionally auto-batch sub-ms cases (run the target k times per sample) so the
measured quantity clears timer resolution.

---

## 3. Benchmark-evidence updates to existing catalog entries

### #102 / C9: FIXED 2026-07-03 — moved to `perf-done.md` (originally `perf-todo.md`, Score 6)

The 2026-07-03 run provides the first end-to-end proof, and it is worse than "report-only":

- `selection:groupedSelected10Percent` — v9 returns an **empty row model** (0 rows vs v8's 10
  group rows) at every row count; checksum DIFF at 1k/20k/100k/400k. Group-row ids
  (`group:group-N`) simply don't exist in the core model that
  `table_getGroupedSelectedRowModel` walks (`rowSelectionFeature.utils.ts:284`).
- `selection:filteredSelected10Percent` @20k — v9 is measurably **slower** than v8
  (0.6 vs 0.4 ms) because it walks all 20k core rows where v8 walks the 6.7k filtered rows.
  At 100k/400k v9 still nets out faster only because `selectRowsFn` itself got cheaper.
  Fixing C9 makes v9 strictly faster AND correct.
- The scenario-design gap that let the filtered variant slip through checksum comparison is
  N4 above.

The `getIsSomeRowsSelected` "some ⇒ any" semantic change adjacent to this code is already
recorded as deliberate in perf-done (#47 notes) — no action there.

### #78 / B9+E14 sort-key precomputation (`perf-todo.md`, Score 6): `text` sorting is now the worst scenario in the suite relative to v8

Baseline evidence for prioritization: `sorting:text` is the ONLY comparator scenario at
parity with v8 (400k: 1311→1343 ms and 1392→1187 ms across the two directions; 100k: −2.4% /
+17.9%), because the per-comparison `toString(value).toLowerCase()` allocation (~2 × R log R
per sort) is identical in both versions and dwarfs the #49 clone-removal win. Decorate-sort-
undecorate converts those ~15M `toLowerCase` calls per 400k sort into R=400k, and would pull
`text` in line with the −50%+ scenarios. N3 above is the cheap interim if #78 stays blocked;
N2's wrapper fix also trims the same path.
