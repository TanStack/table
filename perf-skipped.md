# `@tanstack/table-core` — Performance Refactor Catalog: Skipped

Generated from `perf.md`. The original `perf.md` is intentionally preserved.

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 5
- **Source findings:** 5
- **Cross-cutting sweeps:** 0

## Score 1

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

# Feature — column-pinning

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

# Feature — column-resizing

## Score 0

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
