# `@tanstack/table-core` — Performance Refactor Catalog: Skipped

Generated from `perf.md`. The original `perf.md` is intentionally preserved.
2026-07-01: merged with the fresh audit in `perf.md` (findings A1–F18 and verification new-risks mapped to entries 62–147; legacy entries 1–61 retained).

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 12
- **Source findings:** 12
- **Cross-cutting sweeps:** 0

## Score 1

## 145. F7: Lit self-perpetuating update loop — Score: 8

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 8 (as filed)  
**Score note:** REFUTED during adversarial verification; the residual per-render wasted notify scores 1-2 and is covered by open findings #97/#98/#99 (F5/F6/F8).
**Implementation note:** REFUTED during adversarial verification. The claim (`table()` in `render()` → `setOptions` → optionsStore notifies → `host.requestUpdate()` → another render, forever) is impossible because `@tanstack/store` atoms notify SYNCHRONOUSLY inside `set()`, so the subscription's `requestUpdate` fires during `table()`, i.e. inside the host's `render()`; `LitElement.update()` calls `render()` before `super.update()` clears `isUpdatePending`, and `ReactiveElement.requestUpdate()` early-outs while `isUpdatePending` is true, so the notification is swallowed and nothing is rescheduled. No loop; idle tables do not spin. Residual truth (score 2): every host render pays one wasted notify (effect run + `_notifier++` + no-op requestUpdate) plus the F6 descriptor merge; largely fixed by F5/F6/F8 (#97/#98/#99), and a cheap `_syncing` guard remains reasonable hygiene.

**Location:** `packages/lit-table/src/TableController.ts`
**Category:** `render-path`

F7 claimed Lit's `TableController` enters a self-perpetuating render loop: `table()` called inside `render()` triggers `setOptions`, which notifies the options store, which calls `host.requestUpdate()`, triggering another render, forever. This is refuted: store notifications fire synchronously inside `render()`, and `ReactiveElement.requestUpdate()` early-outs while `isUpdatePending` is still true, so the notification is swallowed and no loop is scheduled — idle tables do not spin. The residual cost, one wasted notify per host render plus the F6 descriptor merge, is tracked as a much smaller finding and is largely addressed by the open F5/F6/F8 items (#97/#98/#99); a cheap `_syncing` guard remains reasonable hygiene on top of those fixes.

---

## 30. `existingGrouping.includes(colId)` per cell value access — Score: 7

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 7  
**Score note:** Small grouping arrays make the Set refactor unjustified in real usage.
**Implementation note:** Per project guidance, `grouping` state typically holds 1–3 columns. At that size, `.includes()` on the array is ~2–3 reference comparisons — cheaper than a Set lookup (hash + bucket walk + comparison), and avoids the per-row-model-rebuild Set allocation. The G × C × R scale table assumes G grows; in real grouped tables G is bounded and small, so the constant-factor Set overhead would dominate the saved comparisons. See [[skip-policy-small-state-arrays]] for the project-wide rule.

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:141–152`
**Category:** `big-o`

The grouped row's `getValue(colId)` calls `.includes()` on `existingGrouping` once (or twice — finding #31) per access. With G grouped columns and C total columns called over R grouped rows that's O(G × C × R). Cache as a Set built once at row-model build time.

**Before**

```ts
// Don't aggregate columns that are in the grouping
if (existingGrouping.includes(colId)) {
  if (hasOwn(row._valuesCache, colId)) {
    return row._valuesCache[colId]
  }

  if (groupedRows[0]) {
    row._valuesCache[colId] = groupedRows[0].getValue(colId) ?? undefined
  }

  return row._valuesCache[colId]
}
```

**After**

```ts
// at top of _createGroupedRowModel:
const existingGroupingSet = new Set(existingGrouping)
// in closure:
getValue: (colId: string) => {
  if (existingGroupingSet.has(colId)) { ... }
  ...
}
```

**Big-O:** O(G) → O(1) per cell access.

**Scale impact** (`.includes` compares saved per render of grouped rows — dimension: grouped rows × cell reads × grouping length):

| Grouped rows (R) | Cell reads per row (C) | Grouping cols (G) | Before (R × C × G) | After (R × C × 1) | Saved     |
| ---------------- | ---------------------- | ----------------- | ------------------ | ----------------- | --------- |
| 10               | 10                     | 2                 | 200                | 100               | 100       |
| 100              | 20                     | 3                 | 6,000              | 2,000             | 4,000     |
| 1,000            | 50                     | 5                 | 250,000            | 50,000            | 200,000   |
| 10,000           | 100                    | 10                | 10,000,000         | 1,000,000         | 9,000,000 |

**Risk:** None.

---

## 34. `orderColumns` uses `grouping.includes` — Score: 7

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 7  
**Score note:** Small grouping arrays make the Set refactor unjustified in real usage.
**Implementation note:** Per project guidance, `grouping` state typically holds 1–3 columns. The L × G scale-table line that shows `L × G` ballooning with L assumes G also grows, but G stays bounded in real tables — so the inner walk is essentially L × constant ≈ O(L), comparable to L + G once the per-call Set allocation and hashing overhead are factored in. Matches the same decision recorded in #39 for the pin-side partition. See [[skip-policy-small-state-arrays]].

**Location:** `src/features/column-ordering/columnOrderingFeature.utils.ts:205–225`
**Category:** `big-o`

The `.filter((col) => !grouping.includes(col.id))` runs `.includes` per leaf column. Build a Set once.

**Before**

```ts
const nonGroupingColumns = leafColumns.filter(
  (col) => !grouping.includes(col.id),
)
```

**After**

```ts
const groupingSet = new Set(grouping)
const nonGroupingColumns = leafColumns.filter((col) => !groupingSet.has(col.id))
```

**Big-O:** O(L × G) → O(L + G). Triggered on every column-order / grouping change.

**Scale impact** (`.includes` compares per call — dimension: leaf columns × grouping cols):

| Leaf cols (L) | Grouping cols (G) | Before (L × G) | After (L + G) | Saved  |
| ------------- | ----------------- | -------------- | ------------- | ------ |
| 10            | 1                 | 10             | 11            | -1     |
| 100           | 3                 | 300            | 103           | 197    |
| 1,000         | 5                 | 5,000          | 1,005         | 3,995  |
| 10,000        | 10                | 100,000        | 10,010        | 89,990 |

**Risk:** None.

---

## 24. `column_getFilterValue` / `column_getFilterIndex` linear `.find` — Score: 6

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 6  
**Score note:** Small active-filter arrays make map lookup unjustified in real usage.
**Implementation note:** Per project guidance, `columnFilters` state typically holds 1–3 active filters. At that size, `.find` over the array is essentially O(1) in practice and outperforms a Record/Map lookup (no hashing, no per-rebuild allocation, JIT-friendly). The C × F scale-impact math assumes F grows with C, but in real tables F stays small even when C is large — so the multiplier shown in the table overstates the win. Both alternatives (per-column memo, `table.getColumnFiltersById()`) add overhead that isn't recouped at typical filter counts.

**Location:** `src/features/column-filtering/columnFilteringFeature.utils.ts:156–185`
**Category:** `big-o`, `memoization`

Each call walks the `columnFilters` array. When a filter UI re-renders columns, every column re-walks. Memoize at the column level with deps `[columnFilters, column.id]`, or expose `table.getColumnFiltersById()` (new API) returning a `Record<string, ColumnFilter>`.

**Before**

```ts
return column.table.atoms.columnFilters?.get()?.find((d) => d.id === column.id)
  ?.value
```

**After (new memoized table API)**

```ts
// in columnFilteringFeature.ts
table_getColumnFiltersById: {
  fn: () => Object.fromEntries((table.atoms.columnFilters?.get() ?? []).map(f => [f.id, f])),
  memoDeps: () => [table.atoms.columnFilters?.get()],
},
// in column_getFilterValue
return column.table.getColumnFiltersById()[column.id]?.value
```

**Big-O:** O(n) per call → O(1) lookup; O(n) one-time per `columnFilters` change.

**Scale impact** (`.find` comparisons saved per render — dimension: columns × active filters × renders, with average `.find` walking F/2):

| Cols (C) | Active filters (F) | Renders (R) | Before (≈ C × F/2 × R) | After (build map once: F × R) | Saved      |
| -------- | ------------------ | ----------- | ---------------------- | ----------------------------- | ---------- |
| 10       | 2                  | 10          | 100                    | 20                            | 80         |
| 50       | 5                  | 100         | 12,500                 | 500                           | 12,000     |
| 100      | 10                 | 1,000       | 500,000                | 10,000                        | 490,000    |
| 500      | 20                 | 10,000      | 50,000,000             | 200,000                       | 49,800,000 |

**Risk:** New API name — bikeshed. Backwards compatible.

---

## 36. `[...left, ...right].includes(id)` for center column filtering — Score: 6

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 6  
**Score note:** Set approach skipped, but note preserves possible spread-removal micro-fix.
**Implementation note:** Per project guidance, `columnPinning` state (`left` + `right`) typically holds 1–3 ids per side. At that size, `.includes()` on the small arrays outperforms a Set (no hashing, no per-call allocation). Same reasoning as #39, which deliberately chose `.includes()` over Sets for the cell-side partition. Note: the per-call `[...left, ...right]` spread itself is wasted work and could be removed without converting to a Set — `(left.includes(id) || right.includes(id))` is the equivalent allocation-free check. Documenting that micro-fix here for any later pass that wants to pick it up; not pursuing it now since it doesn't change asymptotic behavior. See [[skip-policy-small-state-arrays]].

**Location:** `src/features/column-pinning/columnPinningFeature.utils.ts:189, 430`
**Category:** `big-o`

Builds an array, then `.includes()` on it for every cell/column. Use a Set.

**Before**

```ts
const leftAndRight: Array<string> = [...left, ...right]
return allCells.filter((d) => !leftAndRight.includes(d.column.id))
```

**After**

```ts
const leftAndRight = new Set<string>()
for (let i = 0; i < left.length; i++) leftAndRight.add(left[i])
for (let i = 0; i < right.length; i++) leftAndRight.add(right[i])
return allCells.filter((d) => !leftAndRight.has(d.column.id))
```

**Big-O:** O(C × (P_l + P_r)) → O(C + P_l + P_r) per row, per call.

**Scale impact** (`.includes` compares per render — dimension: rows × cells × pinned total):

| Rows (R) | Cells/row (C) | Pinned (P) | Before (R × C × P) | After (R × (C + P)) | Saved     |
| -------- | ------------- | ---------- | ------------------ | ------------------- | --------- |
| 10       | 10            | 2          | 200                | 120                 | 80        |
| 100      | 20            | 4          | 8,000              | 2,400               | 5,600     |
| 1,000    | 50            | 6          | 300,000            | 56,000              | 244,000   |
| 10,000   | 100           | 10         | 10,000,000         | 1,100,000           | 8,900,000 |

**Risk:** None.

---

## 94. E4: filterFn_greaterThan re-parses the filter value per row; pre-parse via resolveFilterValue (gated on E3) — Score: 5

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 5  
**Score note:** Real micro-allocation opportunity, but the compatibility shape is too cumbersome for the benefit.
**Implementation note:** Rejected after implementation review. The optimization is legitimate in isolation, but preserving direct-call behavior plus the in-repo `between`/`betweenInclusive` raw-endpoint delegation requires a tagged resolved-value shape and fallback parsing path. That adds subtle internal protocol code to hot filter functions for a narrow opt-in filter family, making the maintenance cost higher than the likely win. #101/E3 remains the important fix; #54 already removed the obvious range-filter array allocations without adding a resolved-value protocol.

**Location:** `packages/table-core/src/fns/filterFns.ts:127–147` (amplified by delegation in :154–198)
**Category:** `big-o` (short-circuit)

Hot path: per row per filtered rebuild; doubled for `greaterThanOrEqualTo` (calls `greaterThan` + `equals`), and `lessThan` = `!greaterThanOrEqualTo`, so a `between` filter can run this parse chain up to 3-4× per row. `Number(filterValue)` (an O(len) numeric parse) and, on the string fallback branch, `String(filterValue).toLowerCase().trim()` (2 allocations) are loop-invariant on the filter value but run per row: R to 4R times per rebuild. Once E3 is fixed, `resolveFilterValue` is free for its real purpose: pre-parse once so the body only reads pre-computed values.

**Cross-refs / gating:** Strictly gated on the #101 (E3) resolveFilterValue bug fix landing first, with tests through the row model.

**Before**

```ts
const numericFilterValue = Number(filterValue)

if (!isNaN(numericFilterValue) && !isNaN(numericRowValue)) {
  return numericRowValue > numericFilterValue
}

const stringValue = (rowValue ?? '').toString().toLowerCase().trim()
const stringFilterValue = String(filterValue).toLowerCase().trim()
return stringValue > stringFilterValue
```

**After (sketch, gated on E3)**

```ts
export const filterFn_greaterThan = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    /* body reads filterValue's pre-resolved numeric/string forms,
           with a raw-value fallback (see risk) */
  },
  {
    autoRemove: (val: any) => testFalsy(val),
    resolveFilterValue: (val: any) => {
      const numericFilterValue = Number(val)
      return Number.isNaN(numericFilterValue)
        ? { num: NaN, str: String(val).toLowerCase().trim(), raw: val }
        : { num: numericFilterValue, str: '', raw: val }
    },
  },
)
```

**Big-O:** O(R) → O(1) filter-value parses per rebuild; on string-comparison columns removes 2R string allocations per rebuild.

**Risk (verifier-amended):** The delegation web is IN-REPO, not just external: `between`/`betweenInclusive` in the same file call `filterFn_greaterThan`/`lessThan` with RAW endpoints, so a body that only reads the resolved shape breaks in-repo callers. The body must detect the tagged shape and fall back to raw parsing, or `between` must resolve endpoints itself; all six fns must agree on the resolved shape. Direct-call semantics change (same caveat class as E1). Design-level, strictly gated on E3 landing first with tests through the row model.
**Verification:** AMENDED, 6 → 5: in-repo raw-endpoint delegation from between/betweenInclusive requires a tagged-shape fallback in the body.

---

## 51. `column_getIsSorted` / `column_getSortIndex` `.find` per call — Score: 4

**Status:** `[-]` skipped

**Adjusted score:** 1  
**Original score:** 4  
**Score note:** Tiny sorting state array makes the memo/map refactor unjustified in real usage.
**Implementation note:** Per project guidance, `sorting` state typically holds 1–3 entries; `.find`/`.findIndex` over an array that size is a couple of reference comparisons and beats memo or hash overhead. The 2026-07-01 fresh audit independently re-reviewed these getters in its doctrine screen-outs and confirmed them clean ("all tiny-array `.find`/`.includes` getters ... were reviewed and deliberately left alone"). See [[skip-policy-small-state-arrays]] and the precedent entries #24/#30/#34/#36.

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:388–418`
**Category:** `memoization`

Both walk the `sorting` array; called for every visible sortable column on every render. Memoize per column with deps `[sorting, column.id]`, or add `table.getSortingById()`.

**Scale impact** (`.find`/`.findIndex` compares per render — dimension: visible sortable cols × active sorts × renders):

| Cols (C) | Active sorts (S) | Renders (R) | Before (≈ C × S/2 × R, × 2 fns) | After (memoized: ~0) | Saved      |
| -------- | ---------------- | ----------- | ------------------------------- | -------------------- | ---------- |
| 10       | 1                | 10          | 100                             | 0                    | 100        |
| 50       | 3                | 100         | 15,000                          | 0                    | 15,000     |
| 100      | 5                | 1,000       | 500,000                         | 0                    | 500,000    |
| 500      | 10               | 10,000      | 50,000,000                      | 0                    | 50,000,000 |

**Risk:** None.

---

## Score 0

## 108. B22: Row-model memoDeps systematically omit options they read (observation) — Score: 4

**Status:** `[-]` skipped

**Adjusted score:** 0  
**Original score:** 4  
**Score note:** Observation is too broad to implement safely as filed. The sorting-specific portion would require adding function-valued sort/column-definition inputs to memo deps, which the entry itself correctly rejects because adapter option objects/functions often change identity. Remaining primitive-flag cases should be handled as concrete scoped entries rather than this umbrella observation.
**Implementation note:** Skipped as an implementation ticket. `createSortedRowModel` has no primitive table-option dep to add; it reads sorting state plus column-defined/function-valued sort metadata. `createExpandedRowModel` already includes `paginateExpandedRows` in deps, and other primitive flag work is better tracked by focused entries with explicit semantics/tests. Do not add function-valued options such as `sortFns`, aggregation defs, `getSubRows`, or `getIsRowExpanded` to row-model deps without a separate design for stable option identity.

**Location:** `packages/table-core/src/features/column-filtering/createFilteredRowModel.ts`, `packages/table-core/src/features/row-sorting/createSortedRowModel.ts`, `packages/table-core/src/features/column-grouping/createGroupedRowModel.ts`, `packages/table-core/src/features/row-expanding/createExpandedRowModel.ts`, `packages/table-core/src/core/row-models/createCoreRowModel.ts`
**Category:** `observation`, `memoization`

createFilteredRowModel/createSortedRowModel/createGroupedRowModel/createExpandedRowModel/createCoreRowModel all read options (`filterFromLeafRows`, `maxLeafRowFilterDepth`, sort/aggregation defs, `getIsRowExpanded`, ...) that are not deps; runtime option changes serve stale models until an unrelated state change. This is a deliberate single-slot tradeoff for function-valued options (adding them would thrash memos when adapters rebuild options objects); the actionable scope is PRIMITIVE-FLAG additions only (e.g. `filterFromLeafRows`, `maxLeafRowFilterDepth`, `paginateExpandedRows`, the last already fixed in B21's micro entry).

**Fix:** Add the primitive-flag options as deps only; leave the function-valued options (sort/aggregation defs, `getIsRowExpanded`) out of the dep tuples.

**Risk:** Adding the function-valued options as deps would thrash memos when adapters rebuild options objects; the fix must stay scoped to primitive flags only.
**Verification:** CONFIRMED (observation; primitive-only scope is the right boundary).

---

## 78. B9+E14: Sort-key precomputation (decorate-sort-undecorate), built-in sortFns only; design-level — Score: 6

**Status:** `[-]` skipped

**Adjusted score:** 0  
**Original score:** 6  
**Score note:** Not actionable as filed: the built-ins-only fast path would require `createSortedRowModel` to import or identity-match built-in sortFns, coupling the row model to optional sortFn code and breaking tree-shaking. A future design would need opt-in key-extractor metadata on the registered sortFn/registry, so built-ins and custom sortFns flow through the same external contract.
**Implementation note:** Rejected after implementation spike. Importing built-in sortFns or their private comparator helpers into `createSortedRowModel` makes the row model retain built-in sortFn code even when users do not register those functions. That violates the package's feature/registry boundary. Leave the current comparator path intact. If revisited, design a tree-shake-safe API where sortFns can optionally expose a key extractor/comparator over extracted keys without the row model knowing which implementation is built in.

**Location:** `packages/table-core/src/features/row-sorting/createSortedRowModel.ts:88–112` (with `rowSortingFeature.ts:39` default `sortUndefined: 1`; `fns/sortFns.ts:18–30, 58–70` re-derive `toString(value).toLowerCase()` per comparison)
**Category:** `big-o`

Hot path: Per state-change: O(R log R) comparator invocations per sort. `row_getValue` caches in `_valuesCache`, so the accessor runs once per row; the remaining per-comparison cost with the default `sortUndefined: 1` is 2 getValue calls here plus 2 more inside the sortFn = 4 hashed lookups per comparison per column (~7M at R=100k). Worse, the text/alphanumeric sortFns rebuild `toString(value).toLowerCase()` (and, pre-E2, a regex split) on every comparison: O(R log R) string allocations that `_valuesCache` cannot amortize (~3.4M `toLowerCase` allocations per 100k-row sort). A decorate-sort-undecorate pass (one O(R) key extraction into a parallel array, index sort, then materialize) eliminates all per-comparison derivation.

**Before**

```ts
if (sortUndefined) {
  const aValue = rowA.getValue(sortEntry.id)
  const bValue = rowB.getValue(sortEntry.id)

  const aUndefined = aValue === undefined
  const bUndefined = bValue === undefined
  // ...
}

if (sortInt === 0) {
  sortInt = columnInfo.sortFn(rowA, rowB, sortEntry.id)
}
```

**After**

(sketch; flat, single-column fast path, falling back to the current path for multi-column/hierarchy/custom fns)

```ts
// one O(R) pass
const keys = new Array(sortedData.length)
for (let i = 0; i < sortedData.length; i++) {
  keys[i] = sortedData[i]!.getValue(entry.id)
}
```

then a comparator over precomputed keys via an index sort, with `sortUndefined` handled on the extracted keys and stability via index pairing.

**Big-O:** Per-comparison work drops from 4 hashed lookups (+ string realloc for text sorts) to 1 array read. At R=100k text sort: ~1.7M `toLowerCase` allocations → 100k; sort time typically 2-5× faster.

**Risk:** Highest-risk row-model finding; design-level, not a drop-in edit. The fast path must exactly replicate `sortUndefined`/`invertSorting`/tiebreak-by-`row.index` semantics. **Built-in sortFns only** (E14's constraint): user-supplied sortFns can read arbitrary row state and must keep the current path. Sequencing: land E2 first (kills per-comparison split allocations at low risk); B9/E14 kills key re-derivation later.
**Verification:** CONFIRMED (design-level); B9 and E14 merged (same Schwartzian direction; B9's formulation is the actionable one, E14 contributes the built-ins-only constraint).

---

## 2. `assignPrototypeAPIs` allocates wrapper closures on every call — Score: 6

**Status:** `[-]` skipped

**Adjusted score:** 0  
**Original score:** 6  
**Score note:** No measurable win after re-examination.
**Implementation note:** Re-examination of `utils.ts:407–421` showed the original audit misread the code. The two arrow-function wrappers (`memoDeps:` and `fn:`) live inside the `if (!this[memoKey])` block, so they're allocated **once per instance per method**, not per call. Subsequent calls just delegate via `return this[memoKey](...args)`. Removing the `const self = this` alias in favor of capturing `this` lexically saves nothing measurable (it's a stack alias, not a heap allocation) and may even cost slightly more due to lexical-`this` lookup. No win to capture here.

**Location:** `src/utils.ts:402–416`
**Category:** `micro`, `memoization`

Each call to a memoized prototype method (`column.getIsVisible()`, `row.getVisibleCells()`, `header.getSize()`, …) re-creates _two_ arrow functions (`memoDeps`/`fn` wrappers) every call after the lazy init. Pull them out so they're allocated once per prototype, not once per call.

**Before**

```ts
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  // Lazily create memo on first access for this instance
  if (!this[memoKey]) {
    const self = this
    this[memoKey] = tableMemo({
      memoDeps: (depArgs) => memoDeps(self, depArgs),
      fn: (...deps) => fn(self, ...deps),
      fnName,
      objectId: self.id,
      table,
      feature,
    })
  }
  return this[memoKey](...args)
}
```

**After**

```ts
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  if (!this[memoKey]) {
    this[memoKey] = tableMemo({
      memoDeps: (depArgs) => memoDeps(this, depArgs),
      fn: (...deps) => fn(this, ...deps),
      ...
    })
  }
  return this[memoKey](...args)
}
```

(The two closures still capture `memoDeps`/`fn`; the win is dropping the `self` alias and ensuring the closures live inside the one-time init path.)

**Big-O:** Saves 1 allocation per memoized call after init.

**Scale impact** (`self` alias allocations saved — dimension: memoized accessor invocations after init):

| Invocations | Before    | After | Saved     |
| ----------- | --------- | ----- | --------- |
| 1,000       | 1,000     | 0     | 1,000     |
| 10,000      | 10,000    | 0     | 10,000    |
| 100,000     | 100,000   | 0     | 100,000   |
| 1,000,000   | 1,000,000 | 0     | 1,000,000 |

**Risk:** Low. `this` inside a regular function is identical to `self`.

---

## 146. F17: Svelte readonly-atom double read is load-bearing — Score: 0

**Status:** `[-]` skipped

**Adjusted score:** 0  
**Original score:** n/a (rejected during verification, before scoring)  
**Score note:** The double read is deliberate and load-bearing for pre-flush synchronous reads; recommend a source comment instead of a change.
**Implementation note:** From the Rejected section near-verbatim: the `get()` that reads `storeAtom.get()` directly AND touches the `$derived` is deliberate: the version-bump subscription is established inside `$effect`, which does not run until the effect tree first flushes, and `$derived.by` cannot track the TanStack-store graph (only the `version` rune). Reading only the derived would serve a stale cached snapshot for any synchronous read after a write pre-flush, exactly the construct-time/sync-API window core relies on. Keep as-is; add a code comment explaining why the double read exists.

**Location:** `packages/svelte-table/src/reactivity.svelte.ts`
**Category:** `render-path`

F17 flagged the double read in `get()`, reading `storeAtom.get()` directly as well as touching the `$derived` value, as redundant. Verification found it load-bearing: the version-bump subscription that keeps `$derived` fresh is only established once `$effect` first flushes, so before that point (or synchronously after a write, pre-flush) the derived value would return a stale cached snapshot. The direct `storeAtom.get()` read is what guarantees correct synchronous reads in that window. No code change; a comment explaining the rationale was recommended instead.

---

## 147. D2: table.store snapshot atom suspected of per-write rebuilds — verified properly cached — Score: 0

**Status:** `[-]` skipped

**Adjusted score:** 0  
**Original score:** n/a (non-finding)  
**Score note:** Investigated and verified properly cached by @tanstack/store; recorded so nobody re-flags it.
**Implementation note:** Investigated during the 2026-07-01 audit and verified clean against `@tanstack/store@0.11` internals: the `table.store` snapshot atom recomputes only when a state slice actually changes (dirty-dep gating), not on every write. Non-finding; documented here so future audits do not re-flag it.

**Location:** `packages/table-core/src/core/table/constructTable.ts` (store snapshot atom)
**Category:** `memoization`

D2 hypothesized that `table.store`'s snapshot atom rebuilds on every state write regardless of which slice changed. The 2026-07-01 audit's verified-clean pass checked this against `@tanstack/store@0.11` internals and found the atom uses dirty-dependency gating: it only recomputes when a state slice it actually reads has changed, matching the rest of the memo machinery's doctrine. No fix needed; recorded as a non-finding so it is not re-flagged in a future audit pass.

---
