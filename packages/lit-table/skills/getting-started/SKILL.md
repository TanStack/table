---
name: getting-started
description:
  Create and render Table v9 with the lit adapter. Route reusable createTableHook
  components, Virtual integration, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/lit/guide/migrating.md
  - TanStack/table:examples/lit/basic-table-controller
  - TanStack/table:packages/lit-table/src/index.ts
  - TanStack/table:docs/framework/lit/guide/composable-tables.md
  - TanStack/table:examples/lit/composable-tables
  - TanStack/table:packages/lit-table/src/createTableHook.ts
  - TanStack/table:docs/framework/lit/guide/virtualization.md
  - TanStack/table:examples/lit/virtualized-rows
  - TanStack/table:examples/lit/virtualized-columns
  - TanStack/table:examples/lit/virtualized-infinite-scrolling
---

Load `intent load @tanstack/table-core#core` first for the headless model, stable inputs, and column inference.

## Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createColumnHelper,
  tableFeatures,
} from '@tanstack/lit-table'

type Person = { id: string; name: string }

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: 'Name' }),
])

@customElement('people-table')
export class PeopleTable extends LitElement {
  @state() private people: Array<Person> = [{ id: '1', name: 'Ada' }]
  private tableController = new TableController<typeof features, Person>(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.people,
      getRowId: (row) => row.id,
    })

    return html`<table>
      <thead>
        ${repeat(
          table.getHeaderGroups(),
          (group) => group.id,
          (group) =>
            html`<tr>
              ${repeat(
                group.headers,
                (header) => header.id,
                (header) =>
                  html`<th>
                    ${header.isPlaceholder ? null : FlexRender({ header })}
                  </th>`,
              )}
            </tr>`,
        )}
      </thead>
      <tbody>
        ${repeat(
          table.getRowModel().rows,
          (row) => row.id,
          (row) =>
            html`<tr>
              ${repeat(
                row.getAllCells(),
                (cell) => cell.id,
                (cell) => html`<td>${FlexRender({ cell })}</td>`,
              )}
            </tr>`,
        )}
      </tbody>
    </table>`
  }
}
```

## Construction and rendering

Keep one `TableController` as a host field. V9 takes only the host in its constructor; pass current options to `controller.table(...)` during every render. Recreating the controller repeats lifecycle and subscription work.

Keep features, columns, and data stable across host updates. Use `FlexRender({ cell })`, `FlexRender({ header })`, or `FlexRender({ footer })` in Lit templates. The application owns semantic markup, accessibility, widths, and sticky positioning.

The controller selects all registered state by default. Narrow selected state only when host update cost requires it; use [table-state](../table-state/SKILL.md) for selectors and template subscriptions.

## Read for the task

- When adding or configuring optional features, load `intent load @tanstack/table-core#table-features` and read only references for the requested behavior.
- For state ownership or reactive reads, read [table-state](../table-state/SKILL.md).
- When tables share features, defaults, or reusable UI, read [create-table-hook](references/create-table-hook.md).
- When virtualizing rows or columns, read [with-tanstack-virtual](references/with-tanstack-virtual.md).
- When upgrading v8 code, read [migrate-v8-to-v9](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts`, then `TableController.d.ts`, `flexRender.d.ts`, or the relevant exported declaration. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
