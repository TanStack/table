# Lit Table reactivity

Read for Lit subscription boundaries, shared state, or updates that require more than the default rendering behavior.

This reference inherits the version of its owning skill.

## Select a template region independently

<!-- skill-snippet:check tsconfig=examples/lit/basic-table-controller/tsconfig.json -->

```ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
  type TableState,
} from '@tanstack/lit-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]
const noOwnerState = () => null
const pageIndex = (state: TableState<typeof features>) =>
  state.pagination.pageIndex

@customElement('page-island')
export class PageIsland extends LitElement {
  private controller = new TableController<typeof features, { name: string }>(
    this,
  )

  protected render() {
    const table = this.controller.table(
      { features, columns, data },
      noOwnerState,
    )
    return html`
      ${table.subscribe(table.store, pageIndex, (page) => html`<span>Page ${page + 1}</span>`)}
      <button @click=${() => table.nextPage()}>Next</button>
    `
  }
}
```

The owner selector opts this host out of state-driven updates. Every state-dependent region must then subscribe to its own dependencies. Keep both selectors stable. Recreating a `table.subscribe` selector changes its subscription work even if it computes the same value.

## Shared atoms and controlled properties

For cross-system state, create a stable external TanStack Store atom and pass it in `atoms`. Feature APIs write the supplied atom. For host-owned state, use `@state()` plus the corresponding callback, resolve value-or-function updaters, and feed the property into the next `controller.table` call.

Use `table.atoms.pagination.get()` in an event handler for the current snapshot. A cached store property outside render does not stay current and does not subscribe a template region.

## Host lifecycle and accepted updates

Keep the controller as a host field. It owns subscriptions and cleanup. `controller.table` stages fresh options for same-render reads; `hostUpdated` publishes captured controlled state after Lit commits. External atoms remain direct owners.

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts`, then `TableController.d.ts`, `flexRender.d.ts`, or the relevant exported declaration. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/lit/guide/table-state.md`
- `TanStack/table:examples/lit/basic-external-state`
- `TanStack/table:packages/lit-table/src/TableController.ts`
