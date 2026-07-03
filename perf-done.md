# `@tanstack/table-core` — Performance Refactor Catalog: Done

Generated from `perf.md`. The original `perf.md` is intentionally preserved.
2026-07-01: merged with the fresh audit in `perf.md` (findings A1–F18 and verification new-risks mapped to entries 62–147; legacy entries 1–61 retained).

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 33
- **Source findings:** 31
- **Cross-cutting sweeps:** 2

## Score 8

## 35. `row_getLeftVisibleCells` / `row_getRightVisibleCells` use `.find` in pin loop — Score: 8

**Status:** `[x]` done
**Implementation note:** Original audit proposed building a per-call `Map<columnId, cell>` inside each getter. Final implementation went further: reuses the already-memoized `row_getVisibleCellsByColumnId` lookup record (deps `[row.getAllCells(), columnVisibility]`) rather than rebuilding a Map on every call. Result: O(P) bracket lookups per call, with the underlying record amortized to zero rebuild cost across multiple pin-side getters on the same row. Added an early return when the pin side is empty (consistent with the rest of the codebase). Behavior preserved: `cell.position = 'left' | 'right'` mutation, ordering by pin-array index, and hidden-column exclusion via the visible-cells record.

**Location:** `src/features/column-pinning/columnPinningFeature.utils.ts:216–224, 250–257`
**Category:** `big-o`

Each pinned column triggers a linear `.find` over _all_ visible cells of a row. With P pinned and C visible per row, this is O(P × C) per row, per render. Build a `Map<columnId, cell>` once at the top.

**Before**

```ts
for (const columnId of left) {
  const cell = allVisibleCells.find((c) => c.column.id === columnId)
  if (cell) {
    cell.position = 'left'
    cells.push(cell)
  }
}
```

**After**

```ts
const allVisibleCells = callMemoOrStaticFn(
  row,
  'getVisibleCellsByColumnId',
  row_getVisibleCellsByColumnId,
)
const cells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < left.length; i++) {
  const columnId = left[i]!
  const cell = allVisibleCells[columnId]
  if (cell) {
    // Assign position property directly to preserve prototype chain
    ;(cell as any).position = 'left'
    cells.push(cell)
  }
}
return cells
```

**Big-O:** O(P × C) → O(P + C) per row.

**Scale impact** (`.find` comparisons saved per render — dimension: rows × pinned cols × visible cells; average `.find` walks ½ the visible-cell list):

| Rows (R) | Visible cells/row (C) | Pinned cols (P) | Before (R × P × C/2) | After (R × (P + C)) | Saved     |
| -------- | --------------------- | --------------- | -------------------- | ------------------- | --------- |
| 10       | 10                    | 2               | 100                  | 120                 | -20       |
| 100      | 20                    | 4               | 4,000                | 2,400               | 1,600     |
| 1,000    | 50                    | 6               | 150,000              | 56,000              | 94,000    |
| 10,000   | 100                   | 10              | 5,000,000            | 1,100,000           | 3,900,000 |

**Risk:** None. The mutation `cell.position = 'left'` is unchanged.

---

## 37. `passiveEventSupported()` caching bug — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Hoisted `let passiveSupported: boolean | null = null` from inside the function to module scope. Previously the cache check `if (typeof passiveSupported === 'boolean') return passiveSupported` was unreachable on first call and the variable was reset to `null` on every subsequent call, so each invocation re-probed the DOM via `window.addEventListener('test', ...)` + `removeEventListener`. After the hoist the cache actually persists: first call probes once, all later calls short-circuit. Implemented exactly as proposed.

**Location:** `src/features/column-resizing/columnResizingFeature.utils.ts:320–343`
**Category:** `bug`, `micro`

`passiveSupported` is declared _inside_ the function (`let passiveSupported: boolean | null = null`), so the cache check `if (typeof passiveSupported === 'boolean') return passiveSupported` is unreachable on first call and **the cache is reset on every call**. Each resize call probes the DOM via `addEventListener('test', ...)`.

**Before**

```ts
export function passiveEventSupported() {
  let passiveSupported: boolean | null = null
  if (typeof passiveSupported === 'boolean') return passiveSupported
  let supported = false
  try { window.addEventListener('test', noop, options); ... }
  ...
  passiveSupported = supported
  return passiveSupported
}
```

**After**

```ts
let passiveSupported: boolean | null = null

export function passiveEventSupported() {
  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    const noop = () => {}

    window.addEventListener('test', noop, options)
    window.removeEventListener('test', noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}
```

**Big-O:** Avoid a DOM listener add+remove on every resize-handler hook-up.

**Risk:** None. Behavior is what the original obviously intended.

---

## 38. `table_getTotalSize` and the L/C/R variants are not memoized — Score: 8

**Status:** `[x]` done
**Implementation note:** Added `memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]` to all four entries (`table_getTotalSize`, `table_getLeftTotalSize`, `table_getCenterTotalSize`, `table_getRightTotalSize`) in `columnSizingFeature.ts`. Matches the pattern already used by `table_getFooterGroups` / `table_getFlatHeaders`: `table.getHeaderGroups()` is itself memoized against every input that can change the header-row composition (columns, columnOrder, grouping, columnPinning, columnVisibility, groupedColumnMode), so its ref is a compact proxy that holds steady while the underlying inputs don't change. The only other dep is `columnSizing` for per-column width state. Deliberately omitted `columnResizing` — with `columnResizeMode: 'onChange'` (the typical resize-aware setup) the resize handler writes through to `columnSizing` directly, so depending on `columnResizing` would cause redundant invalidations on every drag-move tick without changing the output.

**Location:** `src/features/column-sizing/columnSizingFeature.ts:142–154`
**Category:** `memoization`, `big-o`

All four (`getTotalSize`, `getLeftTotalSize`, `getCenterTotalSize`, `getRightTotalSize`) have **no `memoDeps`** in the feature config. Each call does `.reduce(...)` over the header group, summing `header_getSize` per header (which is itself memoized but still walks the entire array). Layout code reads these every render — for virtualizers, every scroll tick.

**Before**

```ts
table_getTotalSize: { fn: () => table_getTotalSize(table) },
table_getLeftTotalSize: { fn: () => table_getLeftTotalSize(table) },
table_getCenterTotalSize: { fn: () => table_getCenterTotalSize(table) },
table_getRightTotalSize: { fn: () => table_getRightTotalSize(table) },
```

**After**

```ts
table_getTotalSize: {
  fn: () => table_getTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getLeftTotalSize: {
  fn: () => table_getLeftTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getCenterTotalSize: {
  fn: () => table_getCenterTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getRightTotalSize: {
  fn: () => table_getRightTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
```

**Big-O:** O(H) per call → O(1) until column sizing/visibility/pinning changes. High-frequency read path.

**Scale impact** (`header_getSize` invocations skipped — dimension: renders × headers per render; assumes deps unchanged):

| Renders (R) | Headers (H) | Before (R × H) | After (1 × H + later invalidations) | Saved (steady state) |
| ----------- | ----------- | -------------- | ----------------------------------- | -------------------- |
| 10          | 10          | 100            | 10                                  | 90                   |
| 100         | 50          | 5,000          | 50                                  | 4,950                |
| 1,000       | 100         | 100,000        | 100                                 | 99,900               |
| 10,000      | 500         | 5,000,000      | 500                                 | 4,999,500            |

Virtualizers calling `getTotalSize()` per scroll tick amplify this dramatically.

**Risk:** None. Deps fully capture inputs.

---

## 42. `row_getIsAllParentsExpanded` checks the wrong row (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** One-character fix — changed `row_getIsExpanded(row)` to `row_getIsExpanded(currentRow)` inside the parent-walk loop. Previously the function checked the original `row` on every iteration instead of the parent it had just walked to, which made the loop a no-op past the first iteration and returned wrong results (e.g. a leaf row would report "all parents expanded" whenever the leaf itself was expanded, regardless of any collapsed ancestor). Added a comment explaining the intent. Downstream caller in `rowPinningFeature.utils.ts:122` (the `if (row_getIsAllParentsExpanded(fullRow))` check that decides whether a pinned row should appear) automatically gets the correct semantic — pinned rows now correctly account for their ancestor chain's expansion state instead of accidentally tracking the pinned row's own expansion.

**Location:** `src/features/row-expanding/rowExpandingFeature.utils.ts:324–337`
**Category:** `bug`

The loop walks parents but calls `row_getIsExpanded(row)` (original row) instead of `row_getIsExpanded(currentRow)`. Returns wrong result and the loop iterations are wasted.

**Before**

```ts
while (isFullyExpanded && currentRow.parentId) {
  currentRow = row.table.getRow(currentRow.parentId, true)
  isFullyExpanded = row_getIsExpanded(row)
}
```

**After**

```ts
while (isFullyExpanded && currentRow.parentId) {
  currentRow = row.table.getRow(currentRow.parentId, true)
  isFullyExpanded = row_getIsExpanded(currentRow)
}
```

**Big-O:** Correctness fix. Currently the loop is effectively a no-op past one iteration (always re-checks the same `row`).

**Risk:** Behavior changes — verify with tests; this is the intended logic.

---

## 61. `column_getAutoSortFn` never auto-selects `alphanumeric`/`datetime` — `isString` fallback clobbers the match (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Restored v8's early-return precedence (datetime → alphanumeric → text → basic). Discovered during the adversarial verification of #52. The v9 refactor had converted v8's in-loop `return sortingFns.datetime` / `return sortingFns.alphanumeric` (v8 `RowSorting.ts` `getAutoSortingFn`) into assignments to a shared `sortFn` local — but any string value in the sample also sets `isString = true`, and the trailing `if (isString) sortFn = sortFns?.text` unconditionally overwrote the match. Net effect: the auto path never selected `alphanumeric` (dead code) and `datetime` was clobbered whenever any sampled value was a string; digit-bearing string columns silently got plain `text` sorting (`"item10"` before `"item2"`). Each restored early return is guarded (`if (sortFns?.datetime) return ...`) so a custom registry missing an entry falls through to the next preference instead of returning `undefined`. Added `tests/unit/features/row-sorting/rowSortingFeature.utils.test.ts` covering all four selections plus empty-rows and missing-registry-entry fallbacks (no row-sorting utils tests existed before). Related to #50, which fixed the row sampling in the same function. Note for #52: this fix makes `compareAlphanumeric` reachable via the auto path again, so #52's allocation refactor is now worth pursuing.

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:84–122`
**Category:** `bug`

**Before**

```ts
for (let i = 0; i < firstRows.length; i++) {
  const value = firstRows[i]!.getValue(column.id)
  if (Object.prototype.toString.call(value) === '[object Date]') {
    sortFn = sortFns?.datetime
  }
  if (typeof value === 'string') {
    isString = true
    if (value.split(reSplitAlphaNumeric).length > 1) {
      sortFn = sortFns?.alphanumeric
    }
  }
}
if (isString) {
  sortFn = sortFns?.text // clobbers any datetime/alphanumeric match above
}
return sortFn ?? sortFn_basic
```

**After**

```ts
for (let i = 0; i < firstRows.length; i++) {
  const value = firstRows[i]!.getValue(column.id)

  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (sortFns?.datetime) {
      return sortFns.datetime
    }
  }

  if (typeof value === 'string') {
    isString = true

    if (value.split(reSplitAlphaNumeric).length > 1) {
      if (sortFns?.alphanumeric) {
        return sortFns.alphanumeric
      }
    }
  }
}

if (isString) {
  return sortFns?.text ?? sortFn_basic
}

return sortFn_basic
```

**Risk:** Behavior changes for tables relying on the broken default — string columns containing digits now natural-sort (the documented v8 behavior) instead of lexicographic `text` sort.

---

## 63. A1: Table-level column offsets record replaces per-column getStart/getAfter memos — Score: 8

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f), landed together with the A2 deps fix (#67) exactly as the audit required. `table_getColumnOffsets` is registered as a table-level memo in columnSizingFeature.ts (registration at :97+), with the `ColumnOffsetsByPosition` type added in columnSizingFeature.types.ts; the per-column `getStart`/`getAfter` memos were removed and re-registered as plain prototype fns doing O(1) record lookups. Maintainer note: no felt difference at example scales once the rAF coalescing in the resize handler landed (see #66); kept for the single-slot thrash-cliff removal, the 2N-resident-closure memory reduction, and the `getColumnOffsets` primitive itself.

**Location:** `packages/table-core/src/features/column-sizing/columnSizingFeature.ts:54–75` and `packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:100–168`
**Category:** `memoization`, `big-o`

Per tick (onChange resize mode, 60-120Hz) and per render pass. Absolute/sticky layouts call `cell.column.getStart(...)` per visible cell (R_vis × N per render; e.g. `examples/react/column-resizing/src/main.tsx:319` per cell, `examples/react/column-pinning-sticky/src/main.tsx:47-48` calls `getStart('left')`/`getAfter('right')` per cell). The deps tuple contains the ENTIRE `columnSizing` object, whose identity changes on every onChange tick (`Object.assign(makeObjectMap(), old, newColumnSizing)` in `updateOffset`). So resizing ONE column invalidates ALL N columns' `getStart` AND `getAfter` memos every tick. Each recompute walks the recursive chain (`prev.getStart + prev.getSize`) via `callMemoOrStaticFn`; recursion depth is up to N for the far column, and every recursion frame re-evaluates a 6-element memoDeps array plus 5 atom reads. Per tick at N=500 that is ~1000 memo recomputes and ~3000+ transient dep-array allocations, plus 2N permanently resident `tableMemo` closures (`_memo_getStart`, `_memo_getAfter`) per table. There is also a single-slot thrash hazard: a column whose `getStart` is called with two different positions in one render (e.g. `getStart('left')` for sticky style and `getStart()` for a virtualizer) recomputes on every call because `position` lives in the one deps slot.

**Before**

(registration, columnSizingFeature.ts:54-75):

```ts
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
```

and the recursive static fns (columnSizingFeature.utils.ts:100-128; getAfter analogous at 141-168):

```ts
const index = callMemoOrStaticFn(column, 'getIndex', column_getIndex, position)
if (index <= 0) return 0

const visibleLeafColumns = callMemoOrStaticFn(
  column.table,
  'getPinnedVisibleLeafColumns',
  table_getPinnedVisibleLeafColumns,
  position,
)

const prevColumn = visibleLeafColumns[index - 1]!
return (
  callMemoOrStaticFn(prevColumn, 'getStart', column_getStart, position) +
  callMemoOrStaticFn(prevColumn, 'getSize', column_getSize)
)
```

**After**

(one table-level memoized offsets API, O(1) per-column lookups, per-column memos removed). In `columnSizingFeature.utils.ts`:

```ts
export interface ColumnOffsets {
  starts: Record<string, number>
  afters: Record<string, number>
}

export interface ColumnOffsetsByPosition {
  all: ColumnOffsets
  center: ColumnOffsets
  left: ColumnOffsets
  right: ColumnOffsets
}

function buildColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columns: Array<Column_Internal<TFeatures, TData, unknown>>): ColumnOffsets {
  const starts = makeObjectMap<number>()
  const afters = makeObjectMap<number>()
  const sizes = new Array<number>(columns.length)

  let start = 0
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    const size = callMemoOrStaticFn(column, 'getSize', column_getSize)
    sizes[i] = size
    starts[column.id] = start
    start += size
  }

  let after = 0
  for (let i = columns.length - 1; i >= 0; i--) {
    afters[columns[i]!.id] = after
    after += sizes[i]!
  }

  return { starts, afters }
}

export function table_getColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): ColumnOffsetsByPosition {
  return {
    all: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table) as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    center: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'center') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    left: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'left') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    right: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'right') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
  }
}

function toOffsetsKey(
  position: ColumnPinningPosition | 'center' | undefined,
): keyof ColumnOffsetsByPosition {
  return position === 'left'
    ? 'left'
    : position === 'right'
      ? 'right'
      : position === 'center'
        ? 'center'
        : 'all' // undefined | false -> full visible list
}

export function column_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].starts[column.id] ?? 0
}

export function column_getAfter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].afters[column.id] ?? 0
}
```

Registration changes in `columnSizingFeature.ts`:

```ts
  constructTableAPIs: (table) => {
    assignTableAPIs('columnSizingFeature', table, {
      // ...existing APIs...
      table_getColumnOffsets: {
        fn: () => table_getColumnOffsets(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
    })
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      column_getSize: { /* unchanged */ },
      // O(1) lookups now: register as plain non-memoized prototype fns,
      // removing 2N per-instance _memo_ closures (dead weight)
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
      },
      column_resetSize: { /* unchanged */ },
    })
  },
```

Deps coverage (everything `table_getColumnOffsets` reads transitively): `table_getPinnedVisibleLeafColumns` → the L/C/R/all visible-leaf chains → `getAllColumns()` (reads `options.columns`), `orderColumns` (reads `columnOrder`, `grouping`, `groupedColumnMode`), pinning left/right arrays (`columnPinning`), `column_getIsVisible` (`columnVisibility`); `column_getSize` reads `columnDef` (covered by `options.columns`) and `columnSizing[column.id]` (covered by `columnSizing`). Tuple is statically non-empty and the fn always returns an object (never nullish, as `callMemoOrStaticFn`'s `??` fallback requires). No positional arg in the memo (all four position keys computed in one recompute), so render passes interleaving left/center/right cannot thrash it. Missing-column semantics preserved: `?? 0` reproduces the current `index <= 0` / `index < 0` / last-column returns exactly (verified for all five possible `position` values).

**Big-O:** The recompute path collapses from 2N chained memo recomputes (each with a 6-slot dep-array alloc + 5 atom reads + nested `getIndex`/dispatcher memo evals; ~1000 recomputes and ~3000+ array allocations per tick at N=500) to ONE recompute doing 4 classic-loop passes with 8 record allocations total. The single-slot position thrash disappears, and 2N resident `tableMemo` closures per table are removed (N=500: 1000 closures). Note the cache-hit cost is roughly unchanged: each plain `getStart` call still consults the table memo, which evaluates a 7-slot deps array + atom reads per call, comparable to today's per-column cache-hit cost. The wins are the recompute-path collapse, thrash elimination, and closure-memory reduction. Recompute is now O(N) on ANY sizing/order/pinning/visibility/grouping change even if only one region's offsets are consumed (acceptable: that is exactly when offsets change).

**Risk:** Medium-low. Public return shapes unchanged. **A1 MUST land together with A2's dependency fix**: `table_getColumnOffsets` reads through `callMemoOrStaticFn(table, 'getVisibleLeafColumns', ...)` whose memo currently omits `grouping`/`groupedColumnMode` (A2), so A1 alone would rebuild offsets from a stale column list and must not be advertised as a grouping-staleness fix on its own. Keep this offsets memo separate from A4's index memo (`columnSizing` must not invalidate indexes).
**Verification:** AMENDED: design confirmed sound; cache-hit metric corrected (roughly unchanged per call); the grouping-staleness fix is delivered only in combination with A2, on which this finding now explicitly depends.

---

## 67. A2: grouping/groupedColumnMode omitted from sizing/pinning/visibility memoDeps: header/cell column misalignment after setGrouping (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Fixed in PR #6367 (47fc97d2f). `grouping` + `groupedColumnMode` added to the memoDeps tuples in columnPinningFeature.ts (6 registrations), columnVisibilityFeature.ts (`table_getVisibleLeafColumns` / `table_getVisibleFlatColumns`), and columnOrderingFeature.ts (`column_getIndex`, closing the `groupedColumnMode` gap). `header_getStart`'s vestigial `position` dep slot was also dropped (the half of A8 that belonged to this fix; A8's remaining closure-to-stack scope lives in todo #114). Two regression tests added in columnSizingFeature.utils.test.ts, verified to fail against the pre-fix deps.

**Location:**
- `packages/table-core/src/features/column-sizing/columnSizingFeature.ts:56–63, 67–74, 95–102` (`column_getStart`, `column_getAfter`, `header_getStart` deps)
- `packages/table-core/src/features/column-pinning/columnPinningFeature.ts:254–277` (`table_get{Left,Right,Center}LeafColumns` deps) and `:283–309` (`table_get{Left,Center,Right}VisibleLeafColumns` deps)
- `packages/table-core/src/features/column-visibility/columnVisibilityFeature.ts:94–101` (`table_getVisibleLeafColumns` deps) and `:86–101` (`table_getVisibleFlatColumns`, same gap; added during verification)

**Category:** `bug`, `memoization`

Per grouping state-change on any table with `columnGroupingFeature` enabled (default `groupedColumnMode: 'reorder'`, verified at columnGroupingFeature.ts:47). This is a default-configuration hazard. Leaf-column ORDER depends on grouping: `table_getAllLeafColumns` → `table_getOrderColumnsFn` → `orderColumns` reorders/removes grouped columns, and core registers `table_getAllLeafColumns` with `grouping` + `groupedColumnMode` in deps, as does core `table_getHeaderGroups`. But the derived memos above omit both: when `grouping` changes, `getAllLeafColumns` recomputes (new array), yet `table_getVisibleLeafColumns`, `table_getVisibleFlatColumns`, the pinning-region leaf-column memos, and the `column_getStart`/`getAfter`/`header_getStart` memos compare only unchanged inputs and return STALE cached arrays.

**Verified repro (verifier upgrade; worse than originally filed):** `setGrouping(['b'])` under the default `groupedColumnMode: 'reorder'` → `getAllLeafColumns` reorders → `getVisibleLeafColumns` returns the stale array → core `table.getHeaderGroups()` RECOMPUTES (its own deps do include grouping) but its static fn reads the stale `getVisibleLeafColumns` memo, so headers do NOT reorder, while `row.getAllCells()` (deps `[table.getAllLeafColumns()]`) evaluates fresh and cells DO reorder. Result: headers and cells disagree on column order after `setGrouping` on a default-config path. Meanwhile `column_getIndex` (whose deps do include grouping) can disagree with `getStart` in the same render.

**Before**

(columnPinningFeature.ts:292-300, representative):

```ts
      table_getCenterVisibleLeafColumns: {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
        ],
      },
```

**Fix:** (add `table.atoms.grouping?.get()` and `table.options.groupedColumnMode` to each tuple):

- `table_getVisibleLeafColumns` and `table_getVisibleFlatColumns` (columnVisibilityFeature.ts:86-101)
- `table_get{Left,Right,Center}LeafColumns` and `table_get{Left,Center,Right}VisibleLeafColumns` (columnPinningFeature.ts:254-309)
- `column_getStart`, `column_getAfter`, `header_getStart` (columnSizingFeature.ts:56-102); the `header_getStart` grouping slot absorbs A8's part (c)
- While there: `column_getIndex` deps include grouping but omit `groupedColumnMode`; add it (also covered if A4 lands)

**Big-O:** Correctness fix, not a performance metric. `getVisibleLeafColumns`, `getVisibleFlatColumns`, the pinning-region leaf-column memos, `getStart`/`getAfter`/`header_getStart`, and `column_getIndex`'s `groupedColumnMode` slot all return stale cached values after `setGrouping` under the default `groupedColumnMode: 'reorder'`, producing header/cell column-order divergence on every affected render until an unrelated dependency happens to invalidate the memo.

**Risk:** Low. Tables without the grouping feature get stably `undefined` for both new slots (never triggers recompute); the fix strictly aligns recompute triggers with actual data dependencies.

**Dependencies:** **A1 and C3 depend on this fix landing first.** A1's offsets memo and C3's render-path routing both read through `getVisibleLeafColumns`-family memos and would inherit the staleness if shipped alone.

**Verification:** CONFIRMED, severity upgraded to HIGH: the verifier derived the concrete header/cell misalignment repro and extended the affected set to core `table_getHeaderGroups` (transitively) and `table_getVisibleFlatColumns`.

---

## Cross-cutting sweep: loop fusion (`.map().flat()`, `.map().filter()`, `.map().map().filter()`)

**Status:** `[x]` done

**Adjusted score:** 8  
**Original score:** n/a  
**Score note:** Completed cross-cutting allocation and loop-fusion sweep.

Eliminated back-to-back Array method chains across `packages/table-core/src/**` by fusing multiple passes into a single loop. Each chain was producing one intermediate array per stage; fused versions allocate exactly the final result array.

**Patterns covered:**

1. **`.map(hg => hg.headers).flat()`** — 5 sites, all flattening header-groups into a flat header list. Replaced each with a nested indexed `for` loop pushing into a single result array.
   - `core/headers/coreHeadersFeature.utils.ts` — `table_getFlatHeaders`
   - `core/headers/coreHeadersFeature.utils.ts` — `table_getLeafHeaders` (variant: maps to `header.getLeafHeaders()` arrays, same fusion shape)
   - `features/column-pinning/columnPinningFeature.utils.ts` — `table_getLeftFlatHeaders`, `table_getRightFlatHeaders`, `table_getCenterFlatHeaders`

2. **`.map().map().filter()` triple chain** — `createFacetedMinMaxValues.ts`. Fused into the min/max scan loop (which previously ran _after_ the three array stages). Single pass over `flatRows` with `Number()` coercion + NaN skip + inline min/max tracking. Replaces 3 intermediate array allocations of size N and the subsequent min/max walk over the resulting array.

3. **`.map(...).filter(predicate).forEach(mutate)` three-pass chain** — `rowPinningFeature.utils.ts` (`getPinnedRows`). Resolves pinned-row ids → row instances → drops misses → tags `position`, all in one loop. Eliminates 2 intermediate arrays.

4. **`.map().filter()` chain producing-then-cleaning undefineds** — `rowSelectionFeature.utils.ts` (`selectRowsFn` `recurseRows`). The `.map` returns `undefined` for unselected rows; the `.filter(x => !!x)` then removes them. Replaced with single push-into-result loop that skips unselected rows. Saves one intermediate array per recursion level.

5. **Smaller `.map().filter()` chains:**
   - `createFacetedRowModel.ts` — `columnFilters?.map(d => d.id).filter(d => d !== columnId)` + outer `.filter(Boolean)` → single loop pushing matching ids.
   - `columnPinningFeature.utils.ts` `column_pin` — `column.getLeafColumns().map(d => d.id).filter(Boolean)` → single loop.

**Why it matters at scale.** In modern V8, `.map`/`.filter` per-iteration overhead is competitive with hand-written loops (~5–15% per element). The win is **eliminating the intermediate arrays themselves**. Each chain stage allocates an array of size N where N is rows/cells/headers. For a 1M-row faceting pass the prior triple-chain in `createFacetedMinMaxValues` allocated ~3 × 8MB of intermediate buffers per faceted column rebuild; the fused version allocates none of those. Across all 5 patterns and all derivation passes (filter, sort, group, facet, pin), this saves tens of MB of allocations and meaningful GC time on cold builds at 1M-row scale.

**Subsumes existing findings:**

- #21 (`createFacetedMinMaxValues` chain) — done as part of pattern 2 above.

**Type-check verified clean** after the fusion sweep.

## Score 7

## 1. `memo()` deps equality uses `.some()` callback per call — Score: 7

**Status:** `[x]` done
**Implementation note:** Replaced the `.some()` callback with an indexed `for` loop + `break` in `src/utils.ts` (memoizedFn body). Drops one closure allocation per memo invocation. Implemented exactly as proposed.

**Location:** `src/utils.ts:136–156`
**Category:** `micro`

`memo()` is the foundation of every memoized accessor on the table, column, row, cell, and header (called _many_ thousands of times per render in a large table). The `.some(callback)` allocates a closure each call and prevents engine inlining of the cheap reference-equality check.

**Before**

```ts
const newDeps = memoDeps?.(depArgs)
const depsChanged =
  !newDeps ||
  newDeps.length !== deps?.length ||
  newDeps.some((dep: any, index: number) => deps?.[index] !== dep)
```

**After**

```ts
const newDeps = memoDeps?.(depArgs)
let depsChanged = !newDeps || newDeps.length !== deps?.length
if (!depsChanged && newDeps) {
  for (let i = 0; i < newDeps.length; i++) {
    if (newDeps[i] !== deps![i]) {
      depsChanged = true
      break
    }
  }
}
```

**Big-O:** No asymptotic change. Constant-factor — one of the most-executed code paths in the library, so worth the few extra lines.

**Scale impact** (closure allocations saved per render — dimension: number of memoized-accessor calls per render across the whole table):

| Calls / render | Closures before | After | Saved / render |
| -------------- | --------------- | ----- | -------------- |
| 1,000          | 1,000           | 0     | 1,000          |
| 10,000         | 10,000          | 0     | 10,000         |
| 100,000        | 100,000         | 0     | 100,000        |
| 1,000,000      | 1,000,000       | 0     | 1,000,000      |

**Risk:** None. Identical semantics.

---

## 12. `centerColumns` filter runs over all leaf columns even when nothing is pinned — Score: 7

**Status:** `[x]` done
**Implementation note:** Original audit proposed converting `left`/`right` arrays to Sets. On reflection that's the wrong fix: pinning in real tables is usually 1–2 cols per side, where `.includes` on a small array beats a Set (no hashing, no extra object allocation, JIT-friendly). The actual win is in the common case where **nothing is pinned at all** — today the function does _all_ the per-side partition work, even with empty pin lists. Refactor: hoist the pin-emptiness check to the top of `table_getHeaderGroups` and bail to `buildHeaderGroups(allColumns, leafColumns, table)` directly. Skips the `getAllLeafColumnsById()` call, two empty-array allocations, two for-loops over empty arrays, the `.filter` pass, and the final 3-way spread.

**Location:** `src/core/headers/coreHeadersFeature.utils.ts:81–134`
**Category:** `micro`

**Before**

```ts
const { left, right } =
  table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const allColumns = table.getAllColumns()
const leafColumns = callMemoOrStaticFn(
  table,
  'getVisibleLeafColumns',
  table_getVisibleLeafColumns,
)
const leafColumnsById = table.getAllLeafColumnsById()

const leftColumns: typeof leafColumns = []
for (const columnId of left) {
  /* push if visible */
}
const rightColumns: typeof leafColumns = []
for (const columnId of right) {
  /* push if visible */
}

const centerColumns = leafColumns.filter(
  (column) => !left.includes(column.id) && !right.includes(column.id),
)

return buildHeaderGroups(
  allColumns,
  [...leftColumns, ...centerColumns, ...rightColumns],
  table,
)
```

**After**

```ts
const { left, right } =
  table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const allColumns = table.getAllColumns()
const leafColumns = callMemoOrStaticFn(
  table,
  'getVisibleLeafColumns',
  table_getVisibleLeafColumns,
)

// Fast path: no columns are pinned — skip per-side lookups, partition, and spread.
if (!left.length && !right.length) {
  return buildHeaderGroups(allColumns, leafColumns, table)
}

const leafColumnsById = table.getAllLeafColumnsById()

const leftColumns: typeof leafColumns = []
for (let i = 0; i < left.length; i++) {
  const column = leafColumnsById[left[i]!]
  if (
    column &&
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
  ) {
    leftColumns.push(column)
  }
}

const rightColumns: typeof leafColumns = []
for (let i = 0; i < right.length; i++) {
  const column = leafColumnsById[right[i]!]
  if (
    column &&
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
  ) {
    rightColumns.push(column)
  }
}

const centerColumns = leafColumns.filter(
  (column) => !left.includes(column.id) && !right.includes(column.id),
)

return buildHeaderGroups(
  allColumns,
  [...leftColumns, ...centerColumns, ...rightColumns],
  table,
)
```

**Big-O:** Same asymptotic complexity; constant-factor win in the no-pin case (which is most tables). When pinning is active, one extra boolean check at the top — negligible.

**Scale impact** (work saved per `getHeaderGroups()` call when **no columns are pinned**):

| Leaf cols (L) | Before: filter callbacks + spread allocs + 2 empty arrays + `getAllLeafColumnsById()` | After            | Saved             |
| ------------- | ------------------------------------------------------------------------------------- | ---------------- | ----------------- |
| 10            | 10 callbacks + 2 arrays(size 10) + 2 empty arrays + 1 method call                     | 0 (early return) | full work skipped |
| 100           | 100 + 2 arrays(100) + 2 empty + 1 call                                                | 0                | full work skipped |
| 1,000         | 1,000 + 2 arrays(1,000) + 2 empty + 1 call                                            | 0                | full work skipped |
| 10,000        | 10,000 + 2 arrays(10,000) + 2 empty + 1 call                                          | 0                | full work skipped |

**Risk:** None. Behavior unchanged. The `leafColumns` reference is reused (not mutated) when pinning is off — `buildHeaderGroups` reads but does not write to its input array.

---

## 14. `recurseHeadersForSpans` uses `Math.min(...arr)` spread — Score: 7

**Status:** `[x]` done
**Implementation note:** Collapsed `.filter().map()` chain into a single `for…of` loop with `continue` on invisible headers (per project eslint preference for `for…of`). Inlined the inner `.forEach()` over recursive children as a `for…of` loop. Eliminated `Math.min(...childRowSpans)` spread (which would have hit engine arg-count limits on extremely wide header rows) by tracking `minChildRowSpan` inline during the same loop that sums `colSpan`. **Edge-case behavior preserved**: when a header has `subHeaders.length > 0` but none pass visibility (theoretically unreachable given `column_getIsVisible` semantics, but possible by construction), the original code's `Math.min(...[])` returned `Infinity` — the refactor initializes `minChildRowSpan = Infinity` so the empty-children branch naturally produces the same value. Per recursion level: removes 1 filtered array allocation, 1 mapped array allocation, 1 child-rowSpan array allocation, and the spread of that array.

**Location:** `src/core/headers/buildHeaderGroups.ts:143–176`
**Category:** `micro`, `big-o` (stack-overflow risk)

`Math.min(...childRowSpans)` spreads into argument list. With very wide header rows this can blow the argument-count stack limit. Also: this function uses `.filter().map()` which allocates two intermediate arrays per recursion level.

**Before**

```ts
const filteredHeaders = headers.filter((header) =>
  callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible),
)
return filteredHeaders.map((header) => {
  ...
  recurseHeadersForSpans(header.subHeaders).forEach(({ colSpan, rowSpan }) => { ... })
  const minChildRowSpan = Math.min(...childRowSpans)
  ...
})
```

**After**

```ts
const results: Array<{ colSpan: number; rowSpan: number }> = []

for (let i = 0; i < headers.length; i++) {
  const header = headers[i]!
  if (!callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible)) {
    continue
  }

  let colSpan = 0
  let minChildRowSpan = Infinity

  if (header.subHeaders.length) {
    const childSpans = recurseHeadersForSpans(header.subHeaders)
    for (let j = 0; j < childSpans.length; j++) {
      const child = childSpans[j]!
      colSpan += child.colSpan
      if (child.rowSpan < minChildRowSpan) {
        minChildRowSpan = child.rowSpan
      }
    }
  } else {
    colSpan = 1
    minChildRowSpan = 0
  }

  header.colSpan = colSpan
  header.rowSpan = minChildRowSpan

  results.push({ colSpan, rowSpan: header.rowSpan })
}

return results
```

**Big-O:** Removes O(n) intermediate filtered array per recursion + eliminates spread-arg stack risk.

**Scale impact** (intermediate arrays + spread risk — dimension: leaf headers in widest row):

| Headers in widest row | Before (filter+map arrays + spread args) | After          | Saved / risk                            |
| --------------------- | ---------------------------------------- | -------------- | --------------------------------------- |
| 10                    | 2 arrays + 10-arg spread                 | 0 extra arrays | safe range                              |
| 100                   | 2 arrays + 100-arg spread                | 0              | safe range                              |
| 1,000                 | 2 arrays + 1,000-arg spread              | 0              | approaches engine arg-limit (~10k–65k)  |
| 10,000                | 2 arrays + 10,000-arg spread             | 0              | may exceed `Math.min` arg-limit → crash |

**Risk:** None. Same output.

---

## 16. `table_getLeafHeaders` memoDeps call expensive functions to compute deps — Score: 7

**Status:** `[x]` done
**Implementation note:** Initially planned to replace the three cascading `callMemoOrStaticFn(...getLeft/Center/RightHeaderGroups)` calls in `memoDeps` with the six root atoms. On closer inspection the entire pinning branch in the function body was also redundant: `table.getHeaderGroups()` already builds the top row in left → center → right order via `buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table)`, so the three side-specific getters give the same set of top-row headers as `getHeaderGroups()[0].headers`. Final form collapses to the same pattern as `table_getFooterGroups` / `table_getFlatHeaders`:

```ts
export function table_getLeafHeaders(table) {
  const topHeaders = table.getHeaderGroups()[0]?.headers ?? []
  const result = []
  for (let i = 0; i < topHeaders.length; i++) {
    const leafHeaders = topHeaders[i].getLeafHeaders()
    for (let j = 0; j < leafHeaders.length; j++) {
      result.push(leafHeaders[j])
    }
  }
  return result
}
// in feature:
table_getLeafHeaders: {
  fn: () => table_getLeafHeaders(table),
  memoDeps: () => [table.getHeaderGroups()],
},
```

Eliminates three memoized cascades per call (down to one reference check against the cached header groups), removes the per-call `columnPinning` atom read, and removes the unused imports (`callMemoOrStaticFn`, `table_getLeftHeaderGroups`, `table_getCenterHeaderGroups`, `table_getRightHeaderGroups`, `HeaderGroup` type) from this file.

**Location:** `src/core/headers/coreHeadersFeature.ts:75–94`
**Category:** `memoization`

The `memoDeps` array invokes `getLeftHeaderGroups()` / `getCenterHeaderGroups()` / `getRightHeaderGroups()` _just to compute the dependency tuple_. Those getters are themselves memoized but still force an equality walk every time. Depend on the underlying root atoms instead.

**Before**

```ts
memoDeps: () => [
  callMemoOrStaticFn(table, 'getLeftHeaderGroups', table_getLeftHeaderGroups),
  callMemoOrStaticFn(table, 'getCenterHeaderGroups', table_getCenterHeaderGroups),
  callMemoOrStaticFn(table, 'getRightHeaderGroups', table_getRightHeaderGroups),
],
```

**After**

```ts
memoDeps: () => [table.getHeaderGroups()]
```

**Big-O:** Avoids 3 memo cascades per `getLeafHeaders()` access.

**Scale impact** (memo-cascade triggers saved per call — dimension: `getLeafHeaders()` invocations per session):

| Calls / session | Cascade triggers before (3/call) | After (cheap atom reads) | Saved cascades |
| --------------- | -------------------------------- | ------------------------ | -------------- |
| 10              | 30                               | 0                        | 30             |
| 100             | 300                              | 0                        | 300            |
| 1,000           | 3,000                            | 0                        | 3,000          |
| 10,000          | 30,000                           | 0                        | 30,000         |

**Risk:** Low. Leaf headers are derived from exactly these inputs.

---

## 47. Table-level selection getters not memoized + per-row atom re-reads — Score: 7

**Status:** `[x]` done
**Implementation note:** Several changes landed together (motivated by a profiled hang: a select-all checkbox column over 500k rows re-running selection scans on every virtualizer scroll frame):

- **Memoized the four table getters** `getIsAllRowsSelected`, `getIsAllPageRowsSelected`, `getIsSomeRowsSelected`, `getIsSomePageRowsSelected`, and added a new memoized `getSelectedRowIds` primitive. Previously these had **no `memoDeps`**, and `memo()` with no deps recomputes on _every_ call — so the header "select all" checkbox re-ran an O(filtered-rows) `.some()` scan on every render. Deps are `rowSelection` + the relevant row model (`getFilteredRowModel()` / `getPaginatedRowModel()`), plus `table.options.enableRowSelection` on the three getters that consult `row_getCanSelect`. `getIsSomeRowsSelected` depends on `rowSelection` only (it delegates to `getSelectedRowIds`).
- **Eliminated per-row atom re-reads** in the scans. `isRowSelected` now takes the already-fetched `rowSelection` map as a parameter instead of calling `table.atoms.rowSelection.get()` once per row. The single fetched map is threaded through `getIsAllRowsSelected`, `getIsAllPageRowsSelected`, `selectRowsFn`, and `isSubRowSelected`; the redundant `isRowIdSelected` helper was removed.
- **Routed internal calls through `callMemoOrStaticFn`** so they hit the instance memo, and fixed a key bug: one call site passed the prefixed name `'table_getIsAllPageRowsSelected'`, which never matches the stripped instance method `getIsAllPageRowsSelected`, so it silently fell back to the un-memoized static fn every time.
- **Simplified `getIsSome*`** to "≥1 selected" (delegating to `getSelectedRowIds`). This is a deliberate behavior change from v8's "some but not all" semantics; documented in the migration guides. The three `get*SelectedRowModel` getters reuse the same emptiness short-circuit via `getIsSomeRowsSelected`.
- `RowSelectionState` narrowed to `Record<string, true>` (delete-on-deselect invariant), letting `getSelectedRowIds` use a bare `Object.keys`.
- The originally-proposed `return !preGroupedFlatRows.some(...)` flow tweak was **not** the win and was not adopted; the `let/if/return` shape is retained for the empty-selection short-circuit. Tests added asserting the getters memoize (a `vi.fn` `enableRowSelection` call-count probe) and invalidate on selection change.

**Location:** `src/features/row-selection/rowSelectionFeature.ts:120–155`, `rowSelectionFeature.utils.ts` (`isRowSelected`, `getIsAll*`, `getIsSome*`, `getSelectedRowIds`, `selectRowsFn`)
**Category:** `memoization`, `micro`

```ts
table_getIsAllRowsSelected: {
  fn: () => table_getIsAllRowsSelected(table),
  memoDeps: () => [
    table.atoms.rowSelection?.get(),
    table.getFilteredRowModel(),
    table.options.enableRowSelection,
  ],
},
// getIsAllPageRowsSelected / getIsSomePageRowsSelected: same shape with getPaginatedRowModel()
table_getIsSomeRowsSelected: {
  fn: () => table_getIsSomeRowsSelected(table),
  memoDeps: () => [table.atoms.rowSelection?.get()], // delegates to memoized getSelectedRowIds
},
```

**Big-O:** O(filtered-rows) per call → O(1) until selection or the row model changes. Within the (now memo-gated) first scan, per-row atom reads drop from N to 1.

**Scale impact** (`getIsAllRowsSelected` `.some()` scans saved during scroll/render churn — dimension: renders × filtered rows, selection unchanged):

| Renders × Rows | Scan walks before | After (steady state) | Saved      |
| -------------- | ----------------- | -------------------- | ---------- |
| 10 × 1,000     | 10,000            | 0                    | 10,000     |
| 100 × 10,000   | 1,000,000         | 0                    | 1,000,000  |
| 60 × 100,000   | 6,000,000         | 0                    | 6,000,000  |
| 60 × 500,000   | 30,000,000        | 0                    | 30,000,000 |

**Risk:** Low. Memo deps capture every input the getters read (selection, row model, `enableRowSelection`). The `getIsSome*` semantic change is intentional and documented.

---

## 49. `createSortedRowModel` clones every row before sorting — Score: 7

**Status:** `[x]` done
**Implementation note:** Investigated why the clone existed: the post-sort loop assigns `row.subRows = sortData(row.subRows)`, which would corrupt the source row model if `row` were the original. So the clone is genuinely necessary for **rows with subRows**, but pointless for leaf rows. Refactored: `rows.slice()` produces a sortable array copy (one allocation), the sort runs as before, and the post-sort loop clones only rows where `row.subRows.length > 0`. Leaf rows pass through as their original references. For a flat table (the common case) this drops from N heavy clones to **zero per-row clones** plus one `slice()`. For nested tables, only parent rows are cloned (typically a small fraction of total rows). The native `Array.prototype.sort` is stable since ES2019; the explicit `row.index` tiebreaker was preserved in the comparator for any caller that relied on it.

**Location:** `src/features/row-sorting/createSortedRowModel.ts:81–89`
**Category:** `big-o`, `micro`

```ts
const sortedData = rows.map((row) => {
  const cloned = Object.create(Object.getPrototypeOf(row))
  return Object.assign(cloned, row)
})
```

This allocates N row clones every time the sorted row model rebuilds. `Array.prototype.sort` is stable since ES2019, so the clones are unnecessary. Sort the original references with a tie-break index for stability or rely on engine stability.

**After**

```ts
// If there are sub-rows, sort them. Clone only rows that need mutation
// (i.e. have subRows) so we don't corrupt the source row model.
for (let i = 0; i < sortedData.length; i++) {
  const row = sortedData[i]!
  if (row.subRows.length) {
    // Preserve prototype chain so methods like getValue() remain accessible
    const cloned = Object.create(Object.getPrototypeOf(row))
    Object.assign(cloned, row)
    cloned.subRows = sortData(row.subRows)
    sortedData[i] = cloned
    sortedFlatRows.push(cloned)
  } else {
    sortedFlatRows.push(row)
  }
}

return sortedData
```

**Big-O:** Drops O(n) heavy object allocations per sort.

**Scale impact** (heavy row clones replaced with lightweight `{row, index}` wrappers — dimension: rows sorted per sort pass):

| Rows sorted | Before (full row clones via `Object.create` + `Object.assign`) | After (`{row, index}` wrappers) | Saved                         |
| ----------- | -------------------------------------------------------------- | ------------------------------- | ----------------------------- |
| 10          | 10 heavy clones                                                | 10 small wrappers               | ~10 wide → narrow allocations |
| 100         | 100                                                            | 100                             | ~100                          |
| 1,000       | 1,000                                                          | 1,000                           | ~1,000                        |
| 10,000      | 10,000                                                         | 10,000                          | ~10,000                       |

(Memory is the bigger win than count: each "heavy clone" copies _all_ enumerable fields on a constructed Row, vs `{row, index}` which is 2 fields.)

**Risk:** Behavior depends on whether downstream code mutates the returned rows. The current clone is defensive against mutation. Verify nothing post-sort writes to row instances (the project uses prototype methods, so mutations should not occur).

---

## 50. `column_getAutoSortFn` `slice(10)` should be `slice(0, 10)` (bug) — Score: 7 (bug)

**Status:** `[x]` done
**Implementation note:** One-character fix — `slice(10)` → `slice(0, 10)`. Now correctly samples the first 10 filtered rows for sort-fn auto-detection instead of dropping the first 10 and taking everything after. With ≤10 rows the prior `slice(10)` returned an empty array, so the loop was a no-op and the function silently fell back to the basic/alphanumeric default regardless of actual data types. No existing tests pinned the broken behavior; typecheck clean.

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:79–114`
**Category:** `bug`

```ts
const firstRows = column.table.getFilteredRowModel().flatRows.slice(10)
```

This takes rows from index 10 _onwards_, not the first 10. The intent (per the variable name `firstRows`) is the first 10 samples for auto-detection of `sortFn`. With ≤10 rows the array is empty → fallback to alphanumeric sort regardless of actual data types.

**After**

```ts
const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10)
```

**Risk:** Changes auto-detected sort fn for tables that have ≥11 rows. Existing tests may need adjustment if they relied on the broken behavior.

---

## 66. A3: updateOffset: batch the per-tick double atom write; skip the commit-sizing loop in onEnd mode — Score: 7

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f). updateOffset's two writes are wrapped in `table._reactivity.batch` (1 notification flush per tick instead of 2); the `newColumnSizing` commit loop is skipped on onEnd-mode move ticks and the `forEach` became an indexed loop; the drag-end commit+reset sequence is batched (3 flushes → 1). Tests assert the flush counts. Related non-audit work in the same PR, worth recording here: requestAnimationFrame coalescing was added to `header_getResizeHandler` (leading-edge call plus trailing flush per frame) — this was the biggest felt win of the whole resize effort — and lit-table's TableController plus the alpine adapter got selector-based shallow gating of host updates.

**Location:** `packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:128–171` (plus `onEnd` at 175–187)
**Category:** `render-path`, `big-o` (short-circuit), `allocation`

Per tick: every pointermove during a drag at 60-120Hz. Three distinct per-tick problems. (a) Missing short-circuit: in the default `columnResizeMode: 'onEnd'`, the `columnSizingStart.forEach` loop computes `newColumnSizing` on EVERY move tick, but the values are only read at commit ('end' or onChange) and are overwritten next tick; for a group-header drag `columnSizingStart` holds an entry per subtree header (up to N), so up to N wasted multiply/round ops per tick. (b) Unbatched writes: in onChange mode, `table_setColumnResizing` and `table_setColumnSizing` fire two separate atom writes per tick → two subscriber notification flushes → potentially two render passes per tick. `table._reactivity.batch` is available and precedented in core (`coreTablesFeature.utils.ts:27, 58`), and grep confirms no `batch` usage exists anywhere under `table-core/src/features/`. The `onEnd` handler is worse: `updateOffset('end', ...)` (2 writes) plus a third `table_setColumnResizing` reset, three unbatched flushes at drag end. (c) Allocations: per tick, one `forEach` callback closure + one destructuring array per entry + one `{...old}` spread. Cross-adapter evidence (from F12's quantification): each of the 2 unbatched writes per tick notifies every `table.store` subscriber; with S row-level `Subscribe` components the per-tick cost is 2 × S × (selector + shallow compare) even though nothing they select changed. Batching this double write is the single highest-leverage fix on the whole tick path.

**Before**

```ts
const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
  if (typeof clientXPos !== 'number') {
    return
  }

  table_setColumnResizing(column.table, (old) => {
    const deltaDirection =
      column.table.options.columnResizeDirection === 'rtl' ? -1 : 1
    const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection
    const startSize = old.startSize ?? 0
    const deltaPercentage = Math.max(
      startSize > 0 ? deltaOffset / startSize : 0,
      -0.999999,
    )

    old.columnSizingStart.forEach(([columnId, headerSize]) => {
      newColumnSizing[columnId] =
        Math.round(
          Math.max(
            headerSize > 0
              ? headerSize + headerSize * deltaPercentage
              : deltaOffset / old.columnSizingStart.length,
            0,
          ) * 100,
        ) / 100
    })

    return {
      ...old,
      deltaOffset,
      deltaPercentage,
    }
  })

  if (
    column.table.options.columnResizeMode === 'onChange' ||
    eventType === 'end'
  ) {
    table_setColumnSizing(column.table, (old) =>
      Object.assign(makeObjectMap<number>(), old, newColumnSizing),
    )
  }
}
```

**After**

```ts
const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
  if (typeof clientXPos !== 'number') {
    return
  }

  const table = column.table
  const isCommit =
    table.options.columnResizeMode === 'onChange' || eventType === 'end'

  table._reactivity.batch(() => {
    table_setColumnResizing(table, (old) => {
      const deltaDirection =
        table.options.columnResizeDirection === 'rtl' ? -1 : 1
      const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection
      const startSize = old.startSize ?? 0
      const deltaPercentage = Math.max(
        startSize > 0 ? deltaOffset / startSize : 0,
        -0.999999,
      )

      if (isCommit) {
        const columnSizingStart = old.columnSizingStart
        for (let i = 0; i < columnSizingStart.length; i++) {
          const entry = columnSizingStart[i]!
          const headerSize = entry[1]
          newColumnSizing[entry[0]] =
            Math.round(
              Math.max(
                headerSize > 0
                  ? headerSize + headerSize * deltaPercentage
                  : deltaOffset / columnSizingStart.length,
                0,
              ) * 100,
            ) / 100
        }
      }

      return {
        ...old,
        deltaOffset,
        deltaPercentage,
      }
    })

    if (isCommit) {
      table_setColumnSizing(table, (old) =>
        Object.assign(makeObjectMap<number>(), old, newColumnSizing),
      )
    }
  })
}
```

And wrap the drag-end sequence (lines 175-187) in one batch so the 'end' commit + reset flush once:

```ts
const onEnd = (clientXPos?: number) => {
  column.table._reactivity.batch(() => {
    updateOffset('end', clientXPos)

    table_setColumnResizing(column.table, (old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
    }))
  })
}
```

**Big-O:** onChange mode: 2 notification flushes/tick → 1. Scope note (verifier): React 18 already coalesces the two synchronous flushes into one render, so in React/Preact the saving is two subscriber-notification walks → one; the flush-halving of full render passes applies to the store-driven adapters (solid, svelte, vue, lit, angular, alpine, vanilla). onEnd mode (default): eliminates up to |columnSizingStart| float ops + one closure + per-entry destructuring array per tick; drag end 3 flushes → 1. The `Object.assign` O(|sizing|) copy per commit tick remains (required for immutable state identity).

**Risk:** Low-medium. `@tanstack/store@0.11` batch verified nest-safe (batchDepth counter); values apply synchronously inside the batch (functional updaters read fresh state), only notifications coalesce. Behavior change only if a subscriber depended on observing the intermediate `columnResizing` flush before `columnSizing` within one tick. The onEnd-mode skip is unobservable ('end' recomputes all values from absolute positions, not accumulation).
**Verification:** CONFIRMED, with the React-18-coalescing scope amendment and F12's core double-write quantification merged in as cross-adapter evidence.

---

## Score 6

## 9. `cell_getContext()` re-allocates the context object on every call — Score: 6

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: `cell_getContext` is now registered with `memoDeps: (cell) => [cell]` in coreCellsFeature.ts, so the context object is built exactly once per cell instance and the per-render cost is a single-element deps compare.

**Location:** `src/core/cells/coreCellsFeature.utils.ts:51–65`
**Category:** `micro`, `memoization`

Every render that reads `cell.getContext()` (which every framework adapter does for every visible cell) builds a fresh 6-property object. Cells are long-lived; the context is functionally immutable. Cache it on the cell instance.

**Before**

```ts
export function cell_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return {
    table: cell.table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    // Wrap in arrow functions to preserve `this` binding (methods are on prototype)
    getValue: () => cell.getValue(),
    renderValue: () => cell.renderValue(),
  }
}
```

**After**

```ts
export function cell_getContext(cell) {
  if (!cell._contextCache) {
    cell._contextCache = {
      table: cell.table,
      column: cell.column,
      row: cell.row,
      cell,
      getValue: () => cell.getValue(),
      renderValue: () => cell.renderValue(),
    }
  }
  return cell._contextCache
}
```

**Big-O:** Eliminates one object + two arrow-function allocations per visible cell per access. For a 1000-row × 20-col table that's 20k saved allocations per render.

**Scale impact** (allocations saved per render — 1 object + 2 closures per visible cell read):

| Rows × cols (visible cells) | Allocations before / render | After (post-warmup) | Saved / render |
| --------------------------- | --------------------------- | ------------------- | -------------- |
| 10 × 10 = 100               | 300                         | 0                   | 300            |
| 100 × 20 = 2,000            | 6,000                       | 0                   | 6,000          |
| 1,000 × 50 = 50,000         | 150,000                     | 0                   | 150,000        |
| 10,000 × 100 = 1,000,000    | 3,000,000                   | 0                   | 3,000,000      |

**Risk:** Add `_contextCache?` to the internal Cell type. Safe because cell properties are not mutated post-construction.

---

## 52. `compareAlphanumeric` allocates 2 arrays per comparison — Score: 6

**Status:** `[x]` done
**Implementation note:** Went further than proposed — the audit undercounted the allocations. Besides the two `.filter(Boolean)` arrays per comparison, every chunk-pair iteration allocated and **default-sorted** a fresh `[an, bn]` array (`const combo = [an, bn].sort()`), paying array allocation + sort dispatch + number→string coercion just to classify NaN-ness. Since chunks from `reSplitAlphaNumeric` are either all-digit (`parseInt` always succeeds) or digit-free (`parseInt` always `NaN`), two plain `isNaN` checks replace the combo entirely (`aIsNaN && bIsNaN` → both-string branch, `aIsNaN || bIsNaN` → mixed branch). The `.filter(Boolean)` drop required two semantic guards: (1) empty chunks (which only occur at split-array boundaries) are skipped inline at the top of the loop; (2) the prefix tail return counts only **non-empty** remaining chunks instead of raw `aLen - ai - (bLen - bi)`. Net per comparison: 3+k array allocations → 1 per side (the unavoidable `.split()`), where k = chunk pairs visited. Measured on a 10k-row sort of mixed `itemNNNN-revNN` strings (Node, median of 7 runs): **36.5ms → 20.7ms (~43% faster)**. Equivalence verified two ways: a vocab×vocab differential test against the verbatim old implementation (625 pairs covering boundary digits, leading zeros, pure digits, empties, 30-digit overflow) plus targeted boundary-chunk unit tests, all in `tests/unit/fns/sortFns.test.ts`. Unblocked by #61 — the auto path can now actually select `alphanumeric` again.

**Location:** `src/fns/sortFns.ts:154–200`
**Category:** `big-o`, `micro`

`aStr.split(re).filter(Boolean)` runs O(n log n) times during a sort (once per comparison). Each call allocates two arrays. Drop the `.filter(Boolean)` by skipping empty pieces inline.

**Before**

```ts
const a = aStr.split(reSplitAlphaNumeric).filter(Boolean)
const b = bStr.split(reSplitAlphaNumeric).filter(Boolean)
```

**After**

```ts
const a = aStr.split(reSplitAlphaNumeric)
const b = bStr.split(reSplitAlphaNumeric)

let ai = 0
let bi = 0
const aLen = a.length
const bLen = b.length

while (ai < aLen && bi < bLen) {
  // Skip the empty boundary chunks that .filter(Boolean) used to remove
  if (!a[ai]) {
    ai++
    continue
  }
  if (!b[bi]) {
    bi++
    continue
  }

  const aa = a[ai++]!
  const bb = b[bi++]!

  // Chunks are either all-digit (parseInt always succeeds) or digit-free
  // (parseInt is always NaN), so NaN-ness fully classifies each chunk
  const an = parseInt(aa, 10)
  const bn = parseInt(bb, 10)

  const aIsNaN = isNaN(an)
  const bIsNaN = isNaN(bn)

  // Both are string
  if (aIsNaN && bIsNaN) {
    if (aa > bb) {
      return 1
    }
    if (bb > aa) {
      return -1
    }
    continue
  }

  // One is a string, one is a number — the string chunk sorts first
  if (aIsNaN || bIsNaN) {
    return aIsNaN ? -1 : 1
  }

  // Both are numbers
  if (an > bn) {
    return 1
  }
  if (bn > an) {
    return -1
  }
}

// One side is exhausted — compare the counts of remaining non-empty chunks
let remaining = 0
for (; ai < aLen; ai++) {
  if (a[ai]) {
    remaining++
  }
}
for (; bi < bLen; bi++) {
  if (b[bi]) {
    remaining--
  }
}
return remaining
```

**Big-O:** Halves array allocations per comparison; total saves O(N log N) intermediate arrays for sort of N rows.

**Scale impact** (intermediate `.filter()` arrays saved across a single sort — dimension: rows sorted, comparisons ≈ N log₂ N, each saves 2 arrays):

| Rows sorted (N) | Comparisons (≈ N log₂ N) | Before arrays (2 × comps) | After arrays (0) | Saved arrays |
| --------------- | ------------------------ | ------------------------- | ---------------- | ------------ |
| 10              | ~33                      | ~66                       | 0                | ~66          |
| 100             | ~664                     | ~1,328                    | 0                | ~1,328       |
| 1,000           | ~9,966                   | ~19,932                   | 0                | ~19,932      |
| 10,000          | ~132,877                 | ~265,754                  | 0                | ~265,754     |

**Risk:** Careful logic — empty-string skipping must mirror the `.filter(Boolean)` semantics exactly.

---

## 83. F9: Alpine reactive proxy allocates a fresh closure for every method access (per-target fn cache) — Score: 6

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f). Implementation differs slightly from the proposal: wrapper closures are cached per (target, prop) via a `wrapperCache` WeakMap in packages/alpine-table/src/createTable.ts (the audit proposed a per-target `Map` keyed by the resolved function; the per-target-keyed-by-prop WeakMap variant has the same stable-identity effect and the same no-cross-instance-binding guarantee). Additionally, `createTable(options, selector?)` gained a selector argument that shallow-gates the `_ver` bump so non-selected state writes no longer invalidate templates. Unit tests in alpine-table/tests/unit/selectorGate.test.ts.

**Location:** `packages/alpine-table/src/createTable.ts:93–147` (specifically 127–136)
**Category:** `allocation`

Every property read of the returned table (and, recursively, of every object it returns) in Alpine templates: `table.getRowModel` → `rows` → `row.getAllCells` → `cell.getContext`... per row × column × re-render (`_ver` bump per state write, ×2 per resize tick). `proxyCache` (WeakMap) dedupes OBJECT proxies, but the function wrapper is rebuilt on every single `get` of a method: `row.getValue` accessed once per cell per render allocates a new rest-args closure each time. At R_vis×N = 50k cells with ~3 method reads per cell, ~150k closure allocations per template re-evaluation, per `_ver` bump (2 per resize tick). Rest-args + `Function.apply` is also deopt-prone versus a cached wrapper.

**Before**

```ts
const proxy = new Proxy(value, {
  get(target, prop, receiver) {
    if (prop === '__v_skip') {
      return true
    }

    const resolvedValue = Reflect.get(target, prop, receiver)

    if (typeof resolvedValue === 'function') {
      return (...args: Array<unknown>) => {
        void reactivity._ver
        return toReactiveProxy((resolvedValue as Function).apply(target, args))
      }
    }

    void reactivity._ver
    return toReactiveProxy(resolvedValue)
  },
})
```

**After**

(verifier-corrected design: the cache MUST be per-target, not a global WeakMap. In v9, `assignPrototypeAPIs` puts SHARED functions on row/cell/column prototypes, so a global `WeakMap<Function, Function>` keyed on function identity would bind ALL rows to the first row's `target` (the wrapper closes over `target` for `.apply(target, args)`). Create one fn cache per target alongside each proxy in `toReactiveProxy` (targets are already WeakMap-keyed)):

```ts
// created once per target, next to the proxyCache entry:
const fnCache = new Map<Function, Function>()

const proxy = new Proxy(value, {
  get(target, prop, receiver) {
    if (prop === '__v_skip') return true

    const resolvedValue = Reflect.get(target, prop, receiver)

    if (typeof resolvedValue === 'function') {
      let wrapped = fnCache.get(resolvedValue)
      if (!wrapped) {
        wrapped = function (this: unknown, ...args: Array<unknown>) {
          void reactivity._ver
          return toReactiveProxy(
            (resolvedValue as Function).apply(target, args),
          )
        }
        fnCache.set(resolvedValue, wrapped)
      }
      return wrapped
    }

    void reactivity._ver
    return toReactiveProxy(resolvedValue)
  },
})
```

**Big-O:** Method-access allocations per render: O(cells × methods) → O(distinct methods per target) amortized ~0 after warm-up (worst case ~150k closures/render → ~0).

**Risk:** Function identity across reads changes from "always new" to "stable per target", strictly better for Alpine equality checks. The per-target cache's lifetime is tied to the proxy entry, so no cross-instance binding is possible.
**Verification:** AMENDED: the finder's "methods are per-instance closures" assumption is wrong for v9 prototype-shared APIs; the global-WeakMap design was replaced with a per-target fn cache.

---

## Cross-cutting sweep: `for...of` → indexed `for`

**Status:** `[x]` done

**Adjusted score:** 6  
**Original score:** n/a  
**Score note:** Completed codebase-wide Array iteration micro-optimization sweep.

A codebase-wide conversion of `for (const x of arr)` to `for (let i = 0; i < arr.length; i++) { const x = arr[i]! }` for all `Array` iterations in `packages/table-core/src/**`. Roughly 50 loops touched across ~20 files. Rationale: at TanStack Table's scale targets (millions of rows, thousands of columns) the cumulative micro-cost of iterator-protocol overhead is meaningful — especially on cold-JIT first renders, row-model derivation passes that walk full datasets, and `.find` / pinning loops that run per visible row.

Companion change: **flipped the `@typescript-eslint/prefer-for-of` rule from `'warn'` to `'off'`** at the repo root (`eslint.config.js`) with a comment explaining the rationale. New code should default to indexed `for` for Array iteration. `for...of` is still appropriate for `Map`, `Set`, and generators where indexed access isn't available.

This sweep subsumes the loop-style portions of several individual findings:

- #11 (`table_getAllFlatColumnsById` / `getAllLeafColumnsById` `for...of`)
- #17 (`row_getAllCells` `.map` + `row_getAllCellsByColumnId` `for...of`) — also converted `.map` to a preallocated `new Array(length)` + indexed assignment for `row_getAllCells`.
- #23 (faceted min/max — opportunistically swapped `if/if` for `if/else if` for the redundant max check)

Typecheck verified clean after the sweep (`pnpm tsc --noEmit` passes).

**Bug fix included**: `isNumberArray` had been previously auto-converted by the lint rule into `for (const i of d) { d[i] }` — which treats the iteration _value_ as an index and returns `false` for any non-empty number array. The sweep restores the correct indexed form and the function works again as intended.

**Files changed:**

- `utils.ts` (2 loops)
- `core/cells/constructCell.ts` (1)
- `core/columns/constructColumn.ts` (2)
- `core/columns/coreColumnsFeature.utils.ts` (2)
- `core/headers/buildHeaderGroups.ts` (3)
- `core/headers/constructHeader.ts` (1)
- `core/headers/coreHeadersFeature.utils.ts` (2)
- `core/rows/constructRow.ts` (2)
- `core/rows/coreRowsFeature.utils.ts` (1, plus `.map` → preallocated array)
- `core/table/constructTable.ts` (3)
- `core/table/coreTablesFeature.utils.ts` (1)
- `features/column-faceting/createFacetedMinMaxValues.ts` (1)
- `features/column-faceting/createFacetedRowModel.ts` (1)
- `features/column-faceting/createFacetedUniqueValues.ts` (2)
- `features/column-filtering/createFilteredRowModel.ts` (5)
- `features/column-ordering/columnOrderingFeature.utils.ts` (5)
- `features/column-pinning/columnPinningFeature.utils.ts` (6)
- `features/column-visibility/columnVisibilityFeature.utils.ts` (6)
- `features/row-sorting/createSortedRowModel.ts` (1)
- `features/row-sorting/rowSortingFeature.utils.ts` (1)

## Score 5

## 13. `buildHeaderGroups.findMaxDepth` allocates intermediate filtered arrays — Score: 5

**Status:** `[x]` done
**Implementation note:** Replaced `columns.filter(...).forEach(...)` with an indexed `for` loop + `continue` on invisible columns. Drops one filtered-array allocation per recursion level, two callback closures per call (filter + forEach), and removes the spurious `, 0)` second argument to `forEach` that was being ignored. Implemented as proposed.

**Location:** `src/core/headers/buildHeaderGroups.ts:41–48`
**Category:** `micro`

`.filter(...).forEach(...)` creates throwaway arrays at every depth. Inline the visibility check inside a single indexed loop.

**Before**

```ts
columns
  .filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
  .forEach((column) => {
    if (column.columns.length) findMaxDepth(column.columns, depth + 1)
  }, 0)
```

**After**

```ts
for (let i = 0; i < columns.length; i++) {
  const column = columns[i]!
  if (callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) {
    if (column.columns.length) {
      findMaxDepth(column.columns, depth + 1)
    }
  }
}
```

**Big-O:** Same. Saves O(n) allocations per recursion level. Also removes the erroneous `, 0` second-arg to `forEach`.

**Scale impact** (intermediate filtered arrays saved — dimension: total header columns walked, one filtered array per recursion level):

| Header tree size   | Filtered arrays before | After | Saved |
| ------------------ | ---------------------- | ----- | ----- |
| 10 (1 level)       | 1                      | 0     | 1     |
| 100 (3 levels)     | 3                      | 0     | 3     |
| 1,000 (4 levels)   | 4                      | 0     | 4     |
| 10,000 (5+ levels) | 5+                     | 0     | 5+    |

(The win here is constant in tree height, not size — the per-recursion filtered array is the entry that gets eliminated.)

**Risk:** None.

---

## 15. `header_getContext()` re-allocates per call — Score: 5

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: the header context registration now carries `memoDeps: [options.columns]` (coreHeadersFeature.ts:22–25), so the context is cached per header until the column defs change.

**Location:** `src/core/headers/coreHeadersFeature.utils.ts:59–69`
**Category:** `micro`, `memoization`

Mirror of finding #9 for headers.

**Scale impact** (object allocations saved per render — dimension: visible headers × renders that read `header.getContext()`):

| Headers × renders | Before (objs) | After (post-warmup) | Saved   |
| ----------------- | ------------- | ------------------- | ------- |
| 10 × 100          | 1,000         | 10                  | 990     |
| 50 × 1,000        | 50,000        | 50                  | 49,950  |
| 100 × 10,000      | 1,000,000     | 100                 | 999,900 |

**Risk:** Add `_contextCache?` to internal Header type.

---

## 21. `createFacetedMinMaxValues` chains `.map().map().filter()` — Score: 5

**Status:** `[x]` done
**Implementation note:** Fused as part of the loop-fusion sweep (see "Cross-cutting sweep: loop fusion" section near the top). Went further than the original proposal: instead of just collapsing the three `.map().map().filter()` passes into a single `numericValues` loop, the subsequent min/max scan was fused into that same pass too. Net result: one pass over `flatRows`, zero intermediate arrays, inline min/max tracking with `Number.POSITIVE_INFINITY` / `Number.NEGATIVE_INFINITY` seeds and a `foundAny` flag to return `undefined` when no numeric values exist.

**Location:** `src/features/column-faceting/createFacetedMinMaxValues.ts:50–56`
**Category:** `micro`

Three intermediate arrays per faceted column per change. Collapse to a single indexed loop.

**Before**

```ts
const numericValues = flatRows
  .map((flatRow) => flatRow.getValue(columnId))
  .map(Number)
  .filter((value) => !Number.isNaN(value))
```

**After**

```ts
let facetedMinValue = Number.POSITIVE_INFINITY
let facetedMaxValue = Number.NEGATIVE_INFINITY
let foundAny = false

for (let i = 0; i < flatRows.length; i++) {
  const value = Number(flatRows[i]!.getValue(columnId))
  if (Number.isNaN(value)) continue
  foundAny = true
  if (value < facetedMinValue) facetedMinValue = value
  if (value > facetedMaxValue) facetedMaxValue = value
}

if (!foundAny) return undefined
return [facetedMinValue, facetedMaxValue]
```

**Big-O:** O(3n) → O(n) work, 3 array allocations → 1.

**Scale impact** (per faceted column rebuild — dimension: flat rows scanned):

| Flat rows | Before (3 intermediate arrays of ≤n) | After (1 array of ≤n) | Saved arrays |
| --------- | ------------------------------------ | --------------------- | ------------ |
| 10        | 3 of 10                              | 1 of ≤10              | 2 of ~10     |
| 100       | 3 of 100                             | 1 of ≤100             | 2 of ~100    |
| 1,000     | 3 of 1,000                           | 1 of ≤1,000           | 2 of ~1,000  |
| 10,000    | 3 of 10,000                          | 1 of ≤10,000          | 2 of ~10,000 |

**Risk:** None.

---

## Score 4

## 17. `row_getAllCells` / `row_getAllCellsByColumnId` use `.map`/`for...of` — Score: 4

**Status:** `[x]` done
**Implementation note:** Converted as part of the codebase-wide `for...of` → indexed `for` sweep. `row_getAllCells` `.map` was additionally replaced with a preallocated `new Array(columns.length)` + indexed assignment (avoids `.push` reallocation overhead). See the "Cross-cutting sweep" section near the top of this doc.

**Location:** `src/core/rows/coreRowsFeature.utils.ts:163–191`
**Category:** `micro`

Swap `.map()` and `for...of` for indexed loops. Called for every row in the row model whenever cells are read.

**Scale impact** (iterator/callback overhead saved — dimension: cells iterated when row cell collections are built):

| Rows × cols (cells)      | Before (callback/iterator overhead per cell) | After (indexed access) | Saved overhead per pass |
| ------------------------ | -------------------------------------------- | ---------------------- | ----------------------- |
| 10 × 10 = 100            | 100 callback invokes                         | 0                      | 100                     |
| 100 × 20 = 2,000         | 2,000                                        | 0                      | 2,000                   |
| 1,000 × 50 = 50,000      | 50,000                                       | 0                      | 50,000                  |
| 10,000 × 100 = 1,000,000 | 1,000,000                                    | 0                      | 1,000,000               |

**Risk:** None.

---

## 39. `row_getVisibleCells` builds Sets for the small `left`/`right` arrays — Score: 4

**Status:** `[x]` done
**Implementation note:** Original audit proposed a single-pass partition iterating `allCells` directly and dispatching each cell to left/center/right via Set membership. On review that's incorrect: it would push pinned cells in **cell order** rather than **pin order**, changing user-visible behavior (pinning column B then A should display B, A). The existing per-side loop honors pin order correctly. The consistency win available here, matching the approach in #12, is to drop the `leftSet`/`rightSet` allocations used for the center-cell partition and use `.includes()` on the small `left`/`right` arrays directly.

Additional refactor on top: the per-call `cellsByColumnId` local Map was promoted to a new memoized row API, `row.getVisibleCellsByColumnId()` (returns `Record<string, Cell>` with narrower deps `[row.getAllCells(), columnVisibility]` — pinning doesn't invalidate it). Inside `row_getVisibleCells`, the pinned path now reads from this memoized record instead of building a fresh Map per call.

**Do not "optimize" by deriving `visibleCells` from `Object.values(visibleCellsByColumnId)`.** `Object.values()` returns integer-index-like string keys (e.g. `"0"`, `"1"`, `"42"`) first in ascending numeric order, regardless of insertion order. Column IDs come from `accessorKey`, so a user with numeric-string accessor keys (`"2"`, `"10"`, `"1"`) would see their cell order reorder after a round-trip. The Record is safe for bracket-lookup (`record[columnId]`) but unsafe for ordered iteration. Keep `visibleCells` built directly from `row.getAllCells()` to preserve leaf-column order.

**Location:** `src/features/column-visibility/columnVisibilityFeature.utils.ts:157–166`
**Category:** `micro`

**Before**

```ts
// Center cells: visible cells in natural column order, minus pinned ones.
const leftSet = new Set(left)
const rightSet = new Set(right)
const centerCells: Array<Cell<...>> = []
for (const cell of cells) {
  const id = cell.column.id
  if (!leftSet.has(id) && !rightSet.has(id)) centerCells.push(cell)
}
```

**After**

```ts
// Center cells: visible cells in natural column order, minus pinned ones.
const centerCells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < visibleCells.length; i++) {
  const cell = visibleCells[i]!
  const id = cell.column.id
  if (!left.includes(id) && !right.includes(id)) centerCells.push(cell)
}
```

**Big-O:** Same asymptotic complexity; constant-factor win at typical pin counts. With P_l = P_r = 2, `.includes()` is ~4 reference comparisons per cell vs Set hashing + bucket traversal + an upfront Set allocation per side per row.

**Scale impact** (Set object allocations saved per pinned row — dimension: rows that hit the pinned path per render):

| Rows with pinning active per render | Set allocs before (2 per row) | After | Saved Sets |
| ----------------------------------- | ----------------------------- | ----- | ---------- |
| 10                                  | 20                            | 0     | 20         |
| 100                                 | 200                           | 0     | 200        |
| 1,000                               | 2,000                         | 0     | 2,000      |
| 10,000                              | 20,000                        | 0     | 20,000     |

(For very heavily pinned tables — P > ~8 per side — Sets would start to pay off again. Reconsider if a user reports that case.)

**Risk:** None. Output is byte-identical for the typical small-P case; ordering is preserved (Map handles left/right order, center remains in cell order).

---

## 48. `selectRowsFn` spreads row object even when subRows did not change — Score: 4

**Status:** `[x]` done
**Implementation note:** Implemented a **reframed fix** — the proposed `newSubRows !== row.subRows` check is dead on arrival: `recurseRows` allocates a fresh `result` array on every call and returns it unconditionally, so the reference is _always_ different and the check could never skip a clone. (The scale table's premise is also inverted: an unmatched subtree returns `[]`, never the original reference.) The real waste in the same lines: the clone ran for **every** row with subRows, but unselected rows are never pushed to `result` — so their clone was allocated and immediately discarded. Fix: recurse unconditionally (required — selected descendants of unselected parents must still be collected into `flatRows`/`rowsById`), then build the clone only when `isSelected`. Under sparse selection on hierarchical data this eliminates nearly all clones. **Bug fix included:** rows are `Object.create(rowPrototype)` instances, but the old clone was a plain spread `{ ...row, subRows }` — which drops the prototype, so cloned parent rows in the selected row models lost all their prototype APIs (`getValue()`, etc.). The clone now uses the #49 precedent: `Object.assign(Object.create(Object.getPrototypeOf(row)), row)` + `subRows` assignment. Added regression tests (selected child under unselected parent; prototype-method survival on cloned parents) in `tests/implementation/features/row-selection/rowSelectionFeature.test.ts` — the existing suite only covered selected-child-under-selected-parent and would not have caught a recursion-skipping mistake.

**Location:** `src/features/row-selection/rowSelectionFeature.utils.ts:618–658`
**Category:** `micro`

If the recursive `recurseRows(row.subRows)` returns the same reference, skip the spread:

```ts
if (newSubRows !== row.subRows) row = { ...row, subRows: newSubRows }
```

**Big-O:** Same. Saves O(depth × n) shallow clones when nothing in a subtree matched.

**Scale impact** (row spread allocations skipped when subtree unchanged — dimension: parent rows with subrows × renders where selection didn't change them):

| Parent rows with subrows | Skip-clone renders | Before clones | After clones | Saved       |
| ------------------------ | ------------------ | ------------- | ------------ | ----------- |
| 10                       | 10                 | 100           | 0            | 100         |
| 100                      | 100                | 10,000        | 0            | 10,000      |
| 1,000                    | 1,000              | 1,000,000     | 0            | 1,000,000   |
| 10,000                   | 10,000             | 100,000,000   | 0            | 100,000,000 |

**Risk:** Need to confirm the recursion never mutates `row.subRows` in-place. (It does construct a new filtered array, so the reference will differ when results differ.)

---

## Score 3

## 18. `table_getRow` always calls `getCoreRowModel()` — Score: 3

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: `table_getRow` now does an O(1) `rowsById[rowId]` lookup on getRowModel/getPrePaginatedRowModel and falls back to the core row model only on a miss (coreRowsFeature.utils.ts:241–264).

**Location:** `src/core/rows/coreRowsFeature.utils.ts:228–251`
**Category:** `micro`

When the row exists in the primary row model (common case), skip the fallback fetch.

**Before**

```ts
let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel())
  .rowsById[rowId]

if (!row) {
  row = table.getCoreRowModel().rowsById[rowId]
  if (!row) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`getRow could not find row with ID: ${rowId}`)
    }
    throw new Error()
  }
}

return row
```

**After**

```ts
const primary = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel()).rowsById[rowId]
if (primary) return primary
const core = table.getCoreRowModel().rowsById[rowId]
if (core) return core
...
```

**Risk:** None.

---

## 46. `table_toggleAllRowsSelected` clones entire selection on deselect — Score: 3

**Status:** `[~]` partial

**Adjusted score:** 2  
**Original score:** 3  
**Score note:** Opt-in partial improvement landed.
**Implementation note:** Added an opt-in `opts.deselectAll` argument to `table_toggleAllRowsSelected` / `table_toggleAllPageRowsSelected`. When the resolved value is a deselect and `deselectAll` is set, the function returns a fresh empty map in O(1) instead of spreading `old` and `delete`-ing each id. The default path is intentionally unchanged (spread + per-id delete) because an unconditional `{}` return is a **breaking** behavior change — it also drops selected ids that are absent from the current pre-grouped model (e.g. filtered-out rows), which v8 preserved. So the spread/delete cost is only avoided when the caller opts in. Tests added in `rowSelectionFeature.test.ts` (`deselectAll: true` clears an out-of-model id; default preserves it). The behavior change is noted in the framework migration guides.

**Location:** `src/features/row-selection/rowSelectionFeature.utils.ts:78–107`
**Category:** `micro`

When deselecting all, the function spreads `old`, then `delete`s every row id. Just return `{}` (or a fresh map of forced-selected ids) without the spread.

**Scale impact** (per deselect-all action — dimension: prior selection size):

| Prior selections | Before (spread + delete per row) | After (return `{}`) | Saved ops  |
| ---------------- | -------------------------------- | ------------------- | ---------- |
| 10               | 1 spread + 10 deletes            | 0                   | 11 ops     |
| 100              | 1 spread + 100 deletes           | 0                   | 101 ops    |
| 1,000            | 1 spread + 1,000 deletes         | 0                   | 1,001 ops  |
| 10,000           | 1 spread + 10,000 deletes        | 0                   | 10,001 ops |

**Risk:** None.

---

## 57. `aggregationFn_median` full sorts for the median — Score: 3

**Status:** `[~]` partial

**Adjusted score:** 2  
**Original score:** 3  
**Score note:** Map/validation fusion landed; quickselect was skipped.
**Implementation note:** The quickselect-vs-sort question (the headline of this finding) was **not** addressed — `.sort()` is still used because quickselect adds ~50 LOC of complexity that isn't justified without profiling evidence that median is hot for very large groups. The smaller win **was** captured though: fused `.map((row) => row.getValue(columnId))` with the previous `isNumberArray(values)` validation pass into a single loop that extracts values into a preallocated array and bails immediately on the first non-number. Removes one full walk over the values array per call. The full-sort cost remains.

**Location:** `src/fns/aggregationFns.ts:156–166`
**Category:** `big-o`

Median requires only the middle element; quickselect is O(n) average vs `.sort()` O(n log n). Worth it only for large groups; skip otherwise to keep bundle slim.

**Risk:** Quickselect adds bytes and complexity. Recommend leaving as-is unless real-world data shows hot.

---

## Score 2

## 11. `table_getAllFlatColumnsById` / `getAllLeafColumnsById` use `for...of` — Score: 2

**Status:** `[x]` done
**Implementation note:** Converted as part of the codebase-wide `for...of` → indexed `for` sweep. See the "Cross-cutting sweep" section near the top of this doc.

**Location:** `src/core/columns/coreColumnsFeature.utils.ts:175–186, 224–235`
**Category:** `micro`

Swap `for...of` for indexed loops to drop iterator protocol overhead. Cheap, but called every time the column structure is rebuilt.

**Scale impact** (iterator protocol overhead saved per column-structure rebuild — dimension: columns):

| Columns | Iterator calls before | After (indexed) | Saved iterator calls |
| ------- | --------------------- | --------------- | -------------------- |
| 10      | 10                    | 0               | 10                   |
| 100     | 100                   | 0               | 100                  |
| 1,000   | 1,000                 | 0               | 1,000                |
| 10,000  | 10,000                | 0               | 10,000               |

**Risk:** None.

---

## 58. `aggregationFn_unique` + `aggregationFn_uniqueCount` rebuild Set twice — Score: 2

**Status:** `[~]` partial

**Adjusted score:** 1  
**Original score:** 2  
**Score note:** Per-call fusion landed; cross-function sharing was skipped.
**Implementation note:** The cross-function memoization the original finding proposed (sharing a Set between `aggregationFn_unique` and `aggregationFn_uniqueCount` when both run on the same column in the same pass) was **not** implemented — the use case is rare enough that it's not worth the API plumbing. The per-call fusion **was** captured though: both functions now iterate `leafRows` directly into a Set instead of building an intermediate Array via `.map` and then constructing the Set from it. Saves one Array allocation of size `leafRows.length` per call.

**Location:** `src/fns/aggregationFns.ts:172–193`
**Category:** `memoization`

Only useful if both are called on the same column in the same aggregation pass. Not a common pattern; skip unless a consumer hits it.

**Risk:** None.

---

## Score 1

## 5. `isNumberArray()` uses `.every()` — Score: 1

**Status:** `[x]` done
**Implementation note:** Replaced `.every()` callback with an indexed `for` loop + early `return false`. Semantics preserved (empty array still returns `true`, matching the original `.every()` behavior). Drops one closure allocation per call.

**Location:** `src/utils.ts:79–81`
**Category:** `micro`

Replace with an indexed loop and early exit. Low frequency; only used during sort-fn auto-detection.

**Risk:** None.

---

## 23. Faceted min/max loop comparisons — Score: 1

**Status:** `[x]` done
**Implementation note:** `if/if` swapped for `if/else if` (skips the max comparison when min was a hit). Also loop start moved to `i = 1` since `numericValues[0]` is used to seed both `facetedMinValue` and `facetedMaxValue`. Done as part of the `for...of` → indexed `for` sweep.

**Location:** `src/features/column-faceting/createFacetedMinMaxValues.ts:59–65`
**Category:** `micro`

`if (...) ... else if (...)` instead of two unconditional ifs. Tiny.

**Risk:** None.

---
