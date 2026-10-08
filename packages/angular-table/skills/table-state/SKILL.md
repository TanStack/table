---
name: table-state
description:
  Read and control Table v9 state in angular. Use for tracked reads, subscriptions,
  controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:examples/angular/basic-external-state
  - TanStack/table:packages/angular-table/src/injectTable.ts
---

Load `intent load @tanstack/table-core#table-state` first for shared ownership, initialization, updater, and reset rules.

Angular-backed atom reads participate in tracking inside templates, `computed`, and `effect`. A value captured outside those contexts is only a snapshot. Use `computed` for derivation or equality control; wrapping an atom is not required to make it reactive.

## Controlled signal setup

<!-- skill-snippet:check tsconfig=scripts/skill-snippets-angular.tsconfig.json -->

```ts
import { Component, signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

@Component({
  selector: 'page-status',
  template: `<button (click)="table.nextPage()">
    Page {{ table.atoms.pagination.get().pageIndex + 1 }}
  </button>`,
})
export class PageStatus {
  readonly pagination = signal({ pageIndex: 0, pageSize: 20 })
  readonly table = injectTable(() => ({
    features,
    columns,
    data,
    state: { pagination: this.pagination() },
    onPaginationChange: (next) =>
      typeof next === 'function'
        ? this.pagination.update(next)
        : this.pagination.set(next),
  }))
}
```

## Reactive boundaries

- Construct in Angular injection context. Signal writes used by the initializer rerun it and call `setOptions`; hoist features and columns and keep data references stable.
- Supply both `state.pagination` and `onPaginationChange` when a signal owns the slice. Resolve updater functions with `.update(next)` instead of storing the function with `.set(next)`.
- For shared state, create a stable atom with `@tanstack/angular-store` and pass it through `atoms`. Its writes do not need to flow through a controlled signal in the initializer.
- Use `table.store.get()` for the flat state. Prefer `table.atoms.<slice>.get()` for narrow tracked reads.

## Read for the task

For advanced reactive boundaries, shared atoms, or detailed subscription examples, read [reactivity](references/reactivity.md). For construction or rendering setup, read [getting-started](../getting-started/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public declarations. Inspect feature APIs under `node_modules/@tanstack/table-core/dist/features/`.
