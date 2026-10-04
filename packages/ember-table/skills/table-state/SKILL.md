---
name: table-state
description:
  Read and control Table v9 state in ember. Use for tracked reads, subscriptions,
  controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/ember-table'
  framework: ember
  library_version: 9.2.5
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/ember/guide/table-state.md
  - TanStack/table:examples/ember/basic-external-atoms
  - TanStack/table:examples/ember/basic-external-state
  - TanStack/table:packages/ember-table/src/use-table.ts
  - TanStack/table:packages/ember-table/src/reactivity.ts
  - TanStack/table:packages/ember-table/src/signal.ts
---

Load `intent load @tanstack/table-core#table-state` first for shared ownership, initialization, updater, and reset rules.

Glimmer tracks Table APIs, atom reads, and store-property reads inside template-consumed getters. A value cached outside tracked consumption is only a snapshot. There is no `table.Subscribe` or selector argument to `useTable`; `table.store.subscribe` is intentionally a no-op and cannot drive rendering.

## Controlled tracked setup

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/ember-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

export default class PageStatus extends Component {
  @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 10 }
  table = useTable(this, () => ({
    features,
    columns,
    data,
    state: { pagination: this.pagination },
    onPaginationChange: (next) => {
      this.pagination =
        typeof next === 'function' ? next(this.pagination) : next
    },
  }))

  get pageNumber() {
    return this.table.atoms.pagination.get().pageIndex + 1
  }

  nextPage = () => this.table.nextPage()

  <template>
    <button type='button' {{on 'click' this.nextPage}}>Page
      {{this.pageNumber}}</button>
  </template>
}
```

## Reactive boundaries

- Read tracked values inside the options thunk and assign callback results back to their tracked owner. Mutating `this.pagination.pageIndex++` does not notify the thunk.
- `features` and `atoms` are construction-time inputs. Updating ordinary live options does not replace the feature set or atom owners; create them once before `useTable`.
- Pass the component as the owner for lifecycle cleanup when external atoms are used. The standalone one-argument thunk form remains supported.
- Use the adapter's `createAtom` for external Glimmer-reactive ownership. Read it in a tracked getter and use feature APIs or the external atom to write.
- Keep features, columns, and data stable. Call receiver-dependent methods through getters or helpers rather than passing extracted methods to templates.

## Read for the task

For advanced reactive boundaries, shared atoms, or detailed subscription examples, read [reactivity](references/reactivity.md). For construction or rendering setup, read [getting-started](../getting-started/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/ember-table/declarations/index.d.ts`, `use-table.d.ts`, `signal.d.ts`, and `FlexRender.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
