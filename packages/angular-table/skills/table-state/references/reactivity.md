# Angular Table reactivity

Read for Angular subscription boundaries, shared state, or updates that require more than the default rendering behavior.

This reference inherits the version of its owning skill.

## Share state through an external atom

<!-- skill-snippet:check tsconfig=scripts/skill-snippets-angular.tsconfig.json -->

```ts
import { Component, computed } from '@angular/core'
import { createAtom } from '@tanstack/angular-store'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

@Component({ selector: 'page-status', template: `Page {{ pageIndex() + 1 }}` })
export class PageStatus {
  readonly paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  readonly table = injectTable(() => ({
    features,
    columns,
    data,
    atoms: { pagination: this.paginationAtom },
  }))
  readonly pageIndex = computed(
    () => this.table.atoms.pagination.get().pageIndex,
  )
}
```

The atom can feed Query or other consumers without reading a controlled signal in the Table initializer. Table feature APIs write the external atom directly; omit `onPaginationChange` for this owner.

## Derive values with equality control

Use Angular `computed` when deriving a value or applying custom equality. For a recreated object or array result, use the adapter's `shallow` comparator when appropriate. A direct template atom read is already signal-reactive; nested `computed(() => computed(... )())` adds no tracking benefit.

Keep static features, column factories, and row-model factories outside the initializer. Signal reads inside it establish dependencies, so a controlled pagination write reruns the initializer and calls `setOptions`.

## Controlled updater mistakes

Wrong: `onPaginationChange: next => this.pagination.set(next)`.

Correct: use `typeof next === 'function' ? this.pagination.update(next) : this.pagination.set(next)`. Storing the updater itself corrupts the signal's state shape.

Use one owner for each slice. An external atom takes precedence over `state` and starting values; those options are not synchronized fallback owners.

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public declarations. Inspect feature APIs under `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/angular/guide/table-state.md`
- `TanStack/table:examples/angular/basic-external-state`
- `TanStack/table:packages/angular-table/src/injectTable.ts`
