# Ember Table reactivity

Read for Ember subscription boundaries, shared state, or updates that require more than the default rendering behavior.

This reference inherits the version of its owning skill.

## Own shared state with an Ember atom

```gts
import Component from '@glimmer/component'
import { on } from '@ember/modifier'
import {
  createAtom,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/ember-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

export default class SharedPage extends Component {
  paginationAtom = createAtom<PaginationState>({ pageIndex: 0, pageSize: 10 })
  table = useTable(this, () => ({
    features,
    columns,
    data,
    atoms: { pagination: this.paginationAtom },
  }))

  get pageNumber() {
    return this.paginationAtom.get().pageIndex + 1
  }

  nextPage = () => this.table.nextPage()

  <template>
    <button type='button' {{on 'click' this.nextPage}}>Page
      {{this.pageNumber}}</button>
  </template>
}
```

The adapter re-exports `createAtom` with Glimmer-reactive reads. Feature APIs write through to that owner, so omit `onPaginationChange`. Supplying the component owner binds external-atom cleanup to its destruction. Use the one-argument thunk form only when no Ember owner is available.

## Construction-time ownership

The options thunk updates ordinary live options from tracked reads, but features and external atom owners are fixed during construction. Keep them stable. Replacing an `atoms` object in a getter does not swap the table's owners.

## Template tracking is pull-based

Read `table.atoms.<slice>.get()`, `table.store.state.<slice>`, or a Table API inside a template-consumed getter. There is no selector argument or `table.Subscribe`; `table.store.subscribe` is a no-op. Subscribe to a supplied external atom when a separate consumer actually needs push notifications.

`table.getState()` is removed v8 API. Caching a value outside tracked consumption does not establish Glimmer tracking.

## Controlled state pitfalls

Resolve value-or-updater callbacks and assign a fresh tracked value. `this.pagination.pageIndex++` mutates an untracked nested property. A no-op callback freezes the controlled slice. Prefer `table.setPageIndex(...)` to invoke the callback with the feature's update rules.

An external atom wins over controlled state. Writing an internal base atom cannot replace the external value; use the feature API or write the external owner.

## API discovery

Inspect `node_modules/@tanstack/ember-table/declarations/index.d.ts`, `use-table.d.ts`, `signal.d.ts`, and `FlexRender.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/ember/guide/table-state.md`
- `TanStack/table:examples/ember/basic-external-atoms`
- `TanStack/table:examples/ember/basic-external-state`
- `TanStack/table:packages/ember-table/src/use-table.ts`
- `TanStack/table:packages/ember-table/src/reactivity.ts`
- `TanStack/table:packages/ember-table/src/signal.ts`
