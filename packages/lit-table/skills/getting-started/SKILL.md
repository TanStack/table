---
name: getting-started
description: >
  Create a TanStack Lit Table v9 table with a stable TableController host field, explicit tableFeatures, controller.table(options, selector) during render, and headless Lit templates. Load for first-table setup, TableController lifecycle, FlexRender, or adapting a React example to Lit.
metadata:
  type: framework
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.0.0-beta.47'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/lit/guide/migrating.md'
  - 'TanStack/table:examples/lit/basic-table-controller'
  - 'TanStack/table:packages/lit-table/src/index.ts'
---

This skill builds on @tanstack/table-core#core and @tanstack/table-core#table-features. Read them first for the headless and feature-plugin model.

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

## Core Patterns

### Keep static table infrastructure outside render

Create `features`, column helpers, and static columns at module scope. Keep one `TableController` as a host field; call its `table` method during each render with current options.

### Select only state the host renders

```ts
const table = this.tableController.table(
  { features, columns, data: this.people },
  (state) => ({ pagination: state.pagination }),
)
```

Use the default selector for simple tables. Narrow it only when host updates are measurably expensive.

### Treat markup and CSS as application code

Table supplies models and render values. Use semantic elements, accessibility behavior, widths, sticky positioning, and design-system components in the Lit template.

## Common Mistakes

### HIGH Recreating the controller during render

Wrong:

```ts
protected render() {
  const controller = new TableController<typeof features, Person>(this)
  return html`${controller.table({ features, columns, data: this.people }).getRowModel().rows.length}`
}
```

Correct: keep `private tableController = new TableController(this)` as a class field and reuse it.

Each controller registers with the host and owns subscriptions; recreating it leaks lifecycle work and loses stable table state.

Source: TanStack/table:packages/lit-table/src/TableController.ts

### HIGH Passing v8 options to the constructor

Wrong: `new TableController(this, () => ({ data, columns }))`.

Correct: construct with the host only, then call `this.tableController.table({ features, data, columns })` during render.

The v9 controller receives current options through `table`, not a constructor thunk.

Source: TanStack/table:docs/framework/lit/guide/migrating.md

### HIGH Expecting feature state to render UI

Wrong: enable column pinning and assume cells become sticky.

Correct: render the appropriate start/center/end collections and apply sticky offsets and CSS in the template.

TanStack Table is headless; state and models never inject markup or styles.

Source: TanStack/table:docs/overview.md

## API Discovery

Inspect `node_modules/@tanstack/lit-table/src/index.ts` and the exported implementation. Core table and feature APIs are in `node_modules/@tanstack/table-core/src/`.
