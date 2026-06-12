---
name: angular/production-readiness
description: >
  Ship-ready optimizations for Angular Table v9: register only the `features` you actually use
  (tree-shake the bundle); keep `columns` / `features` (which carries row-model factories and
  fn registries) as stable references OUTSIDE the `injectTable` initializer; pass only the `*Fns`
  your data needs as slots on the features object; use `ChangeDetectionStrategy.OnPush`; lean on
  signal-backed atoms (`table.atoms.<slice>.get()`) instead of broad `table.state` reads where
  granularity matters; use `{ equal: shallow }` on object/array `computed` selectors; set
  `getRowId` for stable identity; track by `id` in every `@for`; defer cell components with
  `flexRenderComponent` only when you need its options; scope DI tokens via `[tanStackTable*]`
  directives to kill prop drilling.
type: lifecycle
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/getting-started
  - angular/angular-rendering-directives
sources:
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:packages/angular-table/src/injectTable.ts
  - TanStack/table:packages/angular-table/src/reactivity.ts
  - TanStack/table:examples/angular/composable-tables/
---

# Production Readiness (Angular Table v9)

> Once your table compiles and renders, this is the cost reduction pass.
> Angular's signal-backed adapter makes most of v9's perf "free" if you don't
> fight it — the work is mostly about _what you don't do_: not recreating
> objects, not pulling in features you don't use, not over-wrapping with
> selectors.

---

## 1. Bundle: register only the features you use

The single biggest v9 win is feature tree-shaking. Every feature you put in
`tableFeatures({...})` pulls in its code; everything you leave out is dropped
by the bundler.

```ts
// ❌ Pulls in EVERY feature, even unused ones
const features = stockFeatures

// ✅ Only what this table actually uses
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
})
```

Use `stockFeatures` to bootstrap during a v8 → v9 migration, then **come back
and curate**. The bundle wins only land once you do.

The same applies to feature-fn registries — pass only the `*Fns` your data
needs as slots on the features object:

```ts
import {
  tableFeatures,
  createSortedRowModel,
  createFilteredRowModel,
  sortFns,
  filterFns,
} from '@tanstack/angular-table'

// ❌ pulls in every built-in sort + filter fn
const features = tableFeatures({
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})

// ✅ only what you use
const features = tableFeatures({
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: { basic: sortFns.basic, datetime: sortFns.datetime },
  filterFns: { includesString: filterFns.includesString },
})
```

Same logic for `aggregationFns` if you use grouping.

---

## 2. Stable references — keep them OUTSIDE the initializer

`injectTable(() => ({...}))` **re-runs the initializer every time a signal read
inside it changes** and then calls `table.setOptions({ ...prev, ...new })`.
Anything you create inside the initializer is recreated on every signal
change. Because row-model factories and fn registries live on the `features`
object, keeping `features` stable at module scope covers all of them.

```ts
// ❌ columns / features recreated on every data() change
@Component({...})
export class App {
  readonly table = injectTable(() => ({
    features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns }),
    columns: [/* … */],
    data: this.data(),
  }))
}

// ✅ stable references outside; only reactive reads inside
const features = tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })
const columns: Array<ColumnDef<typeof features, Person>> = [/* … */]

@Component({...})
export class App {
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

Same rule for the controlled-state pattern — keep `state: { pagination: this.pagination() }`
inside the initializer, but keep the signal definitions on the class.

For shared infrastructure across multiple tables, `createTableHook(...)` lets
you define `features` / default options once at module scope.

---

## 3. `ChangeDetectionStrategy.OnPush` everywhere

Every component that hosts or renders a TanStack Table should be:

```ts
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

With signal-backed atoms, OnPush is sufficient — atom reads in the template
are tracked through `computed`, so Angular schedules a check when the signal
changes. Default change detection causes redundant work on every event.

All `examples/angular/*` use `OnPush`. Match that.

---

## 4. Read narrowly — `table.atoms.<slice>.get()` over `table.state`

Both surfaces are signal-backed. The difference is _which signal_ gets read.

```ts
// Wider — reads through the flat state proxy
const pageIndex = computed(() => this.table.state.pagination.pageIndex)

// Narrower — depends only on the pagination atom
const pageIndex = computed(() => this.table.atoms.pagination.get().pageIndex)
```

For most apps the difference is negligible. For render code, high-frequency
atoms, or deeply-derived components, prefer per-atom reads. Keep `table.state`
for places that genuinely want the full-state shape, such as debug JSON.

---

## 5. `{ equal: shallow }` on object/array `computed`

When you derive an object or array slice, downstream `effect`s and `computed`s
re-run whenever the reference changes — even if the structural contents
didn't. Use `shallow` from `@tanstack/angular-table` to short-circuit:

```ts
import { computed } from '@angular/core'
import { shallow } from '@tanstack/angular-table'

readonly pagination = computed(
  () => this.table.atoms.pagination.get(),
  { equal: shallow },
)

readonly visibleColumns = computed(
  () => this.table.atoms.columnVisibility.get(),
  { equal: shallow },
)
```

This is **not** about reactivity — atoms are reactive already. This is about
skipping no-op downstream recomputations when the slice rebuilds with the same
values.

**Don't reach for it on every read.** Reserve it for derived selectors whose
downstream is expensive (effects that hit the server, big template
re-renders).

---

## 6. `track row.id` and `getRowId`

Always provide a stable identity:

```ts
readonly table = injectTable(() => ({
  // ...
  getRowId: (row) => row.id, // stable primary key
}))
```

Then in every `@for`:

```html
@for (row of table.getRowModel().rows; track row.id) { ... } @for (cell of
row.getVisibleCells(); track cell.id) { ... } @for (header of
headerGroup.headers; track header.id) { ... }
```

Without `getRowId`, IDs default to row index — re-rendering the entire row list
on a sort flip, refetch, or pagination move because Angular thinks every row
is new.

---

## 7. Render-cost rules for cells

Cell render fns run for every visible cell on every re-render. Cheap is the
goal.

- **Return a primitive when you can.** `cell: (info) => info.getValue()` is
  fastest.
- **Return a component class (not a wrapper) when only inputs need wiring.**
  The renderer's `KeyValueDiffers` skips `setInput` for unchanged values.
- **Reach for `flexRenderComponent(...)` only for explicit options** —
  custom inputs not derived from context, output callbacks, an injector,
  Angular v20+ `bindings` / `directives`.
- **Don't put expensive `inject()` calls in render fns.** They run inside
  `runInInjectionContext` every render. Inject at the component level and
  close over the value.
- **Don't allocate inside render fns when you can avoid it.** Closures, new
  array literals, etc.

### Stable input references

For object inputs (like `data` arrays you pass into a sub-component), keep the
reference stable across renders. `KeyValueDiffers` is reference-based for
Angular's default input equality, so a `{ ...obj }` literal on every render
defeats it.

---

## 8. Kill prop drilling with DI tokens

Passing `cell` / `header` / `table` through 2+ component layers is both
ergonomic noise and a perf hazard (each input has its own diffing cost).
Replace with the host directives + inject helpers:

```html
<td [tanStackTableCell]="cell">
  <ng-container *flexRenderCell="cell; let value">{{ value }}</ng-container>
  <app-cell-actions />
  <!-- no `cell` input needed -->
</td>
```

```ts
export class CellActionsComponent {
  readonly cell = injectTableCellContext()
  // cell() is a Signal<Cell<...>>; reads are reactive
}
```

Inside `*flexRender*` components, the tokens are auto-provided (no host
directive needed) — see `tanstack-table/angular/angular-rendering-directives`
§7.

---

## 9. Large data — let virtualization do the work

A 10k-row table is fine in v9 in terms of state, but rendering 10k rows is
slow. **Don't render what's off-screen.** Pair with `@tanstack/angular-virtual`
— see `tanstack-table/angular/compose-with-tanstack-virtual`.

Also consider:

- Server-side pagination if data is huge — see
  `tanstack-table/angular/client-to-server`.
- `defaultColumn: { size, minSize, maxSize }` to set sane sizing defaults if
  you've registered `columnSizingFeature`.

---

## 10. Avoid `effect(...)` for cross-slice sync — write directly

```ts
// ❌ Effect chain — runs after CD, can layer-cake
effect(() => {
  const filter = this.globalFilter()
  this.pagination.update((p) => ({ ...p, pageIndex: 0 }))
})

// ✅ Reset inline in the on*Change handler
onGlobalFilterChange: (u) => {
  typeof u === 'function'
    ? this.globalFilter.update(u)
    : this.globalFilter.set(u)
  this.pagination.update((p) => ({ ...p, pageIndex: 0 }))
}
```

The on\*Change handler runs synchronously at the source of truth; an `effect`
runs after Angular's CD pass, which can lead to double renders.

---

## 11. Avoid double-controlling a slice

Don't supply both `state.x` and `atoms.x` for the same slice — atom wins
silently, the Angular signal becomes a write-only sink, and you've doubled
the wiring cost. Pick exactly one source of truth per slice (see
`tanstack-table/angular/table-state` §6–§7).

---

## 12. Build hygiene

- **`bundle-stats` / `source-map-explorer`**: after curating `features`,
  verify your final bundle doesn't include retired features. If you see
  `rowGroupingFeature` in the bundle but never imported it, something is
  pulling in `stockFeatures` indirectly.
- **`debugTable: isDevMode()`** — only in dev. Don't leave `debugTable: true`
  in production.

---

## 13. Quick wins checklist

- [ ] `features` listed explicitly (no `stockFeatures` in production).
- [ ] `*Fns` registry slots on `features` pass only what you use (not the full
      `sortFns` / `filterFns` / `aggregationFns` spread when you can narrow it).
- [ ] `columns` and `features` are at module scope or stable class fields —
      never inside the `injectTable` initializer (factories and fn registries
      live on `features`, so this covers them too).
- [ ] Component is `ChangeDetectionStrategy.OnPush`.
- [ ] `getRowId` set when rows have a stable primary key.
- [ ] All `@for` blocks track by `id`.
- [ ] Cell render fns return primitives or component classes when possible;
      `flexRenderComponent(...)` reserved for explicit-option cases.
- [ ] Reading state inside `effect`s / heavy `computed`s uses
      `table.atoms.<slice>.get()` (not the flat state proxy).
- [ ] Object/array `computed` selectors that feed expensive downstream use
      `{ equal: shallow }`.
- [ ] No `cell` / `header` / `table` inputs drilled through multiple
      components — replaced with `injectTableCellContext()` / etc.
- [ ] `debugTable` only in `isDevMode()`.
- [ ] Tables larger than a few hundred visible rows use virtualization.

---

## Failure modes

### 1. (CRITICAL) Shipping `stockFeatures` to production

`stockFeatures` defeats the v9 bundle wins. The migrating skill explicitly
calls this out — `stockFeatures` is a v8 → v9 bootstrap, not a production
end-state.

### 2. (CRITICAL) Recreating `columns` / `features` inside the `injectTable` initializer

The initializer re-runs on every signal read change. A new `columns` reference
triggers full column-model rebuilds — for big tables this is visibly slow.
Module-scope both `columns` and `features` (which carries the factories and fn
registries).

### 3. (CRITICAL) Reimplementing what the table already does

Symptoms:

- Manual sort on the data array inside a `computed`/`effect`, then passing
  the sorted array to the table.
- Manual pagination math driving `data: paged()` — paginated by the user, not
  the table.
- Hand-rolled global filter `.filter(...)` inside `effect`.

All of these are far slower than the built-in row models (which memoize and
short-circuit) and ship more code. Use `table.setSorting(...)`,
`table.setColumnFilters(...)`, and the row-model factories registered on the
`features` object.

### 4. (HIGH) `OnPush` not set

Default change detection runs on every event in the entire app. Even with
signal-backed atoms, you're paying for unnecessary template checks. `OnPush`
is the table's idiomatic setting.

### 5. (HIGH) `@for` without stable `track`

`@for (row of rows)` without a `track` value at all is a build error in
Angular ≥17 strict mode; `track $index` defeats DOM reuse on sort/refetch.
Always `track row.id` (and `getRowId` on the table).

### 6. (HIGH) Over-wrapping every read in `computed(...)`

```ts
// ❌ adds a computed layer for no reason
readonly pagination = computed(() => this.table.atoms.pagination.get())
```

The atom is already signal-backed. Use `computed` for derivation, custom
equality, or shared selectors — not for "make it reactive."

### 7. (HIGH) `{ equal: shallow }` on every `computed`

Shallow equality has a runtime cost (one pass over keys). For primitive
selectors it's strictly slower than `Object.is`. Reserve it for derived
object/array slices whose downstream is expensive.

### 8. (HIGH) Drilling `cell` / `header` / `table` through multiple

components

Inputs add diffing cost on every change-detection cycle. Replace with the
`[tanStackTableCell]` / `[tanStackTableHeader]` / `[tanStackTable]` host
directives and `injectTableCellContext()` / etc. at the leaf.

### 9. (HIGH) `flexRenderComponent(...)` for every cell

`flexRenderComponent` adds a wrapper with `reflectComponentType` overhead
and an `OutputEmitterRef` subscription scan. For plain component pass-through
where context inputs cover everything, **return the component class
directly** — the renderer does `setInput` on its own.

### 10. (MEDIUM) `effect(...)` chains for what should be on\*Change inline

If the user changes `globalFilter` and your `pagination` reset lives in an
`effect`, you get a CD pass for the filter and a second one for the reset.
Inline the reset in `onGlobalFilterChange`.

### 11. (MEDIUM) Forgetting `autoResetPageIndex: false` for server-driven tables

Every fetch produces a new array reference, which triggers the default
auto-reset and bounces the user back to page 0 mid-pagination. See
`tanstack-table/angular/client-to-server` §9.

### 12. (MEDIUM) `debugTable: true` left in production

Turns on per-operation `console.info` logging from the core. Use
`debugTable: isDevMode()`.

### 13. (MEDIUM) Reaching for `Subscribe` patterns ported from React docs

Angular doesn't need a `Subscribe` boundary the way React does. The
adapter's signal binding handles fine-grained reactivity at the atom level —
templates re-evaluate the dependencies they actually read.

---

## See also

- `tanstack-table/angular/getting-started` — the first-table baseline
- `tanstack-table/angular/table-state` — narrow vs wide reads, controlled state
- `tanstack-table/angular/angular-rendering-directives` — `flexRenderComponent`,
  DI tokens
- `tanstack-table/angular/client-to-server` — server-driven optimizations
- `tanstack-table/angular/compose-with-tanstack-virtual` — virtualizing big
  tables
- Example: `examples/angular/composable-tables/` — `createTableHook` for
  app-wide infrastructure
