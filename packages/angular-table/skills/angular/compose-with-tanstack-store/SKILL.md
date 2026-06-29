---
name: angular/compose-with-tanstack-store
description: >
  Compose TanStack Table v9 with `@tanstack/angular-store`. TanStack Table v9 is itself built on
  TanStack Store — each state slice is an atom. Read surfaces include `table.atoms.<slice>`
  (per-slice readonly, signal-backed), `table.state` / `table.store` (flat readonly views), and `table.baseAtoms.<slice>`
  (writable). The `atoms` table option lets you replace an internal slice with an external
  TanStack Store atom for cross-app sharing (URL sync, persistence, multi-table coordination).
  In Angular, native signals + `state` + `on[State]Change` is the default; reach for external
  atoms only when ownership crosses an app boundary the signal model can't easily span.
type: composition
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - state-management
sources:
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/table:packages/angular-table/src/reactivity.ts
  - TanStack/table:packages/angular-table/src/injectTable.ts
  - TanStack/store:packages/angular-store/src/
---

# Compose with TanStack Store (Angular)

> TanStack Table v9 **is** a TanStack Store consumer. The internal state model
> uses `alien-signals` atoms, exposed as `table.atoms.<slice>`,
> `table.baseAtoms.<slice>`, and the flat `table.store`. In Angular, those
> atoms are signal-backed via the `angularReactivity(injector)` binding.
>
> **For most Angular Table apps, native signals + `state` + `on[State]Change`
> is the right ownership model.** Reach for `@tanstack/angular-store` atoms
> when the slice must travel through code that doesn't share an injection
> scope with the table — URL sync, multi-table coordination, persistence
> layers, server caches, devtools.

---

## 1. The three read surfaces

Every TanStack Table instance exposes its state at three layers:

| Surface                   | Shape                             | Angular reactivity              | Use when                                        |
| ------------------------- | --------------------------------- | ------------------------------- | ----------------------------------------------- |
| `table.baseAtoms.<slice>` | Writable `Atom<T>`                | Backed by an Angular `signal`   | Direct internal writes; rare                    |
| `table.atoms.<slice>`     | Readonly `Atom<T>` (derived)      | Backed by an Angular `computed` | Reading or driving Angular reactivity per-slice |
| `table.state`             | Readonly flat proxy               | Reads from slice atoms          | Full-state JSON/debug output                    |
| `table.store`             | Readonly flat `Store<TableState>` | Backed by an Angular `computed` | Low-level flat store access; rare               |

All three are populated only for **registered features** (`features`). All
three are signal-backed via `angularReactivity(injector)`:
`createReadonlyAtom` → Angular `computed`, `createWritableAtom` → Angular
`signal`, subscriptions bridged through `toObservable(computed(signal), {
injector })`.

Read them inside templates, `computed(...)`, or `effect(...)` and Angular
tracks the dependency.

```ts
this.table.atoms.pagination.get()            // current value (reactive)
this.table.atoms.pagination.subscribe(obs)   // RxJS observer form
this.table.state.pagination                  // flat proxy read; prefer atoms for narrow reads
this.table.baseAtoms.pagination.set(...)     // direct internal write (avoid)
```

---

## 2. The `atoms` option — bring your own atom

The `atoms` table option lets you replace the internal `baseAtom` for a slice
with an **external TanStack Store atom**. Once registered, `table.atoms.<slice>`
reads from that external atom, and `table.set<X>` / `feature.on*Change` write
through it.

```ts
import { Store } from '@tanstack/store'
import {
  injectTable,
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature, rowSortingFeature })

// Module-scope (or app-scope) shared atoms
export const paginationStore = new Store<PaginationState>({
  pageIndex: 0,
  pageSize: 25,
})

export const sortingStore = new Store<SortingState>([])

@Component({...})
export class App {
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    atoms: {
      pagination: paginationStore,
      sorting:    sortingStore,
    },
  }))
}
```

Now `paginationStore.state` and `table.atoms.pagination.get()` always agree.
Any other consumer of `paginationStore` (a URL-sync service, another table,
a devtools panel) sees the same updates.

> **External atoms take precedence over `state.<slice>`.** If you supply both
> `atoms.pagination` and `state.pagination`, the atom wins silently.

---

## 3. When to use external atoms vs Angular signals

The maintainer guidance: **Angular signals first**. Atoms when ownership
crosses boundaries.

| Scenario                                                     | Use                                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Single component owns the slice                              | Angular `signal()` + `state` + `on[State]Change`                             |
| URL-sync (deep-linkable pagination, filter, sort)            | External `Store` atom — see §4                                               |
| Two tables share a `globalFilter`                            | External `Store` atom on a shared module                                     |
| Persisting to `localStorage` between sessions                | External `Store` atom + subscribe to write                                   |
| TanStack Query owns the server cache, table consumes filters | External `Store` atom or Angular signal — both work; pick what reads cleaner |
| Devtools / inspector across multiple tables                  | External `Store` atom — uniform consumer surface                             |

In a pure component-local scenario, an Angular signal is simpler — fewer
imports, no module-level globals, plays nicely with `OnPush`.

---

## 4. Real example — URL-synced pagination

```ts
import { effect, signal } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store } from '@tanstack/store'
import {
  injectTable,
  tableFeatures,
  rowPaginationFeature,
  type PaginationState,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature })

// Shared, app-scope atom
export const paginationStore = new Store<PaginationState>({
  pageIndex: 0,
  pageSize: 25,
})

@Component({
  selector: 'page-route',
  // …
})
export class PageRoute {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  constructor() {
    // Seed from URL once
    const qp = this.route.snapshot.queryParamMap
    paginationStore.setState((p) => ({
      pageIndex: Number(qp.get('p') ?? p.pageIndex),
      pageSize: Number(qp.get('s') ?? p.pageSize),
    }))

    // Mirror to URL
    paginationStore.subscribe(() => {
      const { pageIndex, pageSize } = paginationStore.state
      this.router.navigate([], {
        queryParams: { p: pageIndex, s: pageSize },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      })
    })
  }

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    atoms: {
      pagination: paginationStore, // ← external atom owns the slice
    },
  }))
}
```

`table.nextPage()` now writes to `paginationStore`, which writes to the URL.
A user copying the URL into a new tab lands on the same page.

---

## 5. Read external atom values reactively in Angular

`@tanstack/angular-store` provides `injectSelector` / `injectAtom` for
deriving Angular signals from TanStack Store atoms outside the table context:

```ts
import { injectSelector } from '@tanstack/angular-store'
import { paginationStore } from './stores'

@Component({...})
export class StatsBar {
  readonly pageIndex = injectSelector(paginationStore, (s) => s.pageIndex)
  // Angular Signal<number>, signal-tracked normally
}
```

Inside a table-owning component, you already have `table.atoms.pagination.get()`
— both forms are equivalent because the external atom _is_ the internal atom
for that slice.

---

## 6. Multi-table coordination

A common pattern: two tables on the same page should share a `globalFilter`.

```ts
import { Store } from '@tanstack/store'

export const sharedFilter = new Store<string | null>(null)

const featuresA = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const featuresB = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

// Table A
readonly tableA = injectTable(() => ({
  features: featuresA,
  columns: columnsA,
  data: this.dataA(),
  atoms: { globalFilter: sharedFilter },
}))

// Table B (separate component, same module)
readonly tableB = injectTable(() => ({
  features: featuresB,
  columns: columnsB,
  data: this.dataB(),
  atoms: { globalFilter: sharedFilter },
}))
```

Calling `tableA.setGlobalFilter('foo')` updates `sharedFilter`, which Table B
also reads — both views filter together. Without the shared atom you'd need
a separate cross-component sync mechanism.

---

## 7. Reset semantics

This is a known sharp edge worth understanding:

- `table.resetPagination()` (and equivalents) updates _through the feature
  state updater_. When the slice is owned by an external atom, the external
  atom is updated.
- `table.reset()` (the core API) resets the **internal `baseAtoms`**. Do not
  use it as the primary reset for externally-owned slices — it bypasses your
  external atom.
- For an externally-owned slice, reset by writing to your atom directly
  (`paginationStore.setState({ pageIndex: 0, pageSize: 25 })`) or by calling
  the slice-specific reset API which routes through the updater.

---

## 8. State and atom precedence — the rules

For any given registered slice, the table picks state from this priority order:

1. **`atoms.<slice>`** (external atom) — wins everything
2. **`state.<slice>`** (controlled value, in initializer)
3. **`initialState.<slice>`** (one-time seed)
4. Feature default (slice's blank value)

**Don't supply more than one source for the same slice** unless you
intentionally want a specific layer to win. The precedence is silent — no
runtime warning today.

---

## 9. Cross-app patterns

### Hydration / SSR-like state seeding

For SSR-rendered Angular tables that hydrate a known initial state from the
server payload, the atom approach is the cleanest:

```ts
const paginationStore = new Store<PaginationState>(serverPayload.pagination)
// later:
atoms: {
  pagination: paginationStore
}
```

The atom is constructed with the hydrated value; the table never re-seeds
from `initialState` because `atoms` takes precedence.

### Devtools / inspector

A separate devtools component can subscribe to `paginationStore`,
`sortingStore`, etc. without holding a reference to the table — useful when
the devtools live in a different injection scope.

---

## Failure modes

### 1. (CRITICAL) Reimplementing TanStack Store with raw signals or Subjects

```ts
// ❌ A homegrown shared store
@Injectable({ providedIn: 'root' })
export class FilterService {
  readonly value = signal<string | null>(null)
  setFilter(v: string | null) { this.value.set(v) }
}

// then trying to pipe it into the table…
state: { globalFilter: this.filterService.value() }
onGlobalFilterChange: (u) => /* ... */
```

This works, but you've also lost the atom-bridge that lets `table.setGlobalFilter`
write back through. The atom flow (`atoms: { globalFilter: filterStore }`) is
fewer moving parts and idiomatic v9. Prefer it when the slice spans multiple
consumers.

### 2. (CRITICAL) Supplying both `state.x` and `atoms.x` for the same slice

The atom wins; the Angular signal becomes a write-only ghost. No runtime
warning today. Pick one source of truth per slice. The most common bug here is
"I added atoms.pagination but the on[State]Change handler I left from before
no longer fires" — it does fire (the atom is updated through the table's
updater plumbing), but your Angular signal isn't being read by the table.

### 3. (CRITICAL) Using `table.baseAtoms.x.set(...)` to update an externally-owned slice

`baseAtoms` are the internal writable atoms. When `atoms.x` is registered,
`table.atoms.x` and the feature updater route through the external atom, but
the internal `baseAtoms.x` is now an orphan — writing to it has no effect on
the table's behavior. Write to the external atom instead.

### 4. (HIGH) Calling `table.reset()` on an externally-owned slice

`table.reset()` resets the internal `baseAtoms` — bypasses your external
atom. Use slice-specific resets (`resetSorting()`, `resetPagination()`,
`resetGlobalFilter()`) or write to the external atom directly.

### 5. (HIGH) Forgetting that external atom state is reactive in Angular

Reading `paginationStore.state` in a template **is reactive** in v9 because
the adapter wraps it — but reading it in plain TypeScript outside a reactive
scope is a snapshot. Use `injectSelector(paginationStore, …)` to get an
Angular signal for general consumption, or read `table.atoms.pagination.get()`
inside the component that owns the table.

### 6. (MEDIUM) Putting `new Store(...)` inside a component class field

Module-level (or `providedIn: 'root'` service) is the right place. Creating a
`new Store(...)` in a component field gives you a per-instance atom — which
defeats the cross-app sharing point. Use external atoms specifically for
_shared_ state.

### 7. (MEDIUM) Hand-rolling subscription cleanup

When you `paginationStore.subscribe(fn)`, that returns an unsubscribe. Inside
an Angular component, prefer Angular's `effect(...) +
injectSelector(paginationStore, …)` for derived signals, or
`DestroyRef.onDestroy(unsubscribe)` for raw subscriptions.

---

## See also

- `tanstack-table/angular/table-state` — the prerequisite atom model
- `tanstack-table/angular/client-to-server` — server-driven tables (where
  external atoms shine for URL sync)
- `tanstack-table/angular/compose-with-tanstack-query` — Query + Table
  (sometimes external atoms simplify the bridge)
- `tanstack-table/core/state-management` — framework-agnostic atom semantics
- `@tanstack/angular-store` docs — `injectSelector`, `injectAtom`,
  `createStoreContext`
