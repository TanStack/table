---
name: table-state
description:
  Read and control Table v9 state in lit. Use for tracked reads, subscriptions,
  controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.2.6'
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/lit/guide/table-state.md
  - TanStack/table:examples/lit/basic-external-state
  - TanStack/table:packages/lit-table/src/TableController.ts
---

Load `intent load @tanstack/table-core#table-state` first for shared ownership, initialization, updater, and reset rules.

`TableController` selects all registered state by default and requests host updates when selected state changes. `table.state` is the selected render value. `table.atoms.<slice>.get()` and `table.store.state` are snapshots; those reads do not create a template subscription.

## Controlled property setup

<!-- skill-snippet:check tsconfig=examples/lit/basic-table-controller/tsconfig.json -->

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/lit-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'id' }]
const data = [{ id: '1' }]

@customElement('page-status')
export class PageStatus extends LitElement {
  @state() private pagination: PaginationState = { pageIndex: 0, pageSize: 10 }
  private controller = new TableController<typeof features, { id: string }>(
    this,
  )

  protected render() {
    const table = this.controller.table({
      features,
      columns,
      data,
      state: { pagination: this.pagination },
      onPaginationChange: (next) => {
        this.pagination =
          typeof next === 'function' ? next(this.pagination) : next
      },
    })
    return html`<button @click=${() => table.nextPage()}>
      Page ${table.state.pagination.pageIndex + 1}
    </button>`
  }
}
```

## Reactive boundaries

- Keep one controller on the host and pass current options during render. Keep features, columns, and data references stable across host updates.
- A second `controller.table(options, selector)` argument changes the shape of `table.state` and gates host updates. Keep reused selectors stable.
- Use `table.subscribe(source, selector, renderCallback)` for a template region that should update independently. Cache selector functions as host fields or module functions.
- Feed every controlled callback result into the corresponding reactive property and pass it back through `state`. Use stable external atoms through `atoms` when sharing state outside the host.

## Read for the task

For advanced reactive boundaries, shared atoms, or detailed subscription examples, read [reactivity](references/reactivity.md). For construction or rendering setup, read [getting-started](../getting-started/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts`, then `TableController.d.ts`, `flexRender.d.ts`, or the relevant exported declaration. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
