---
name: getting-started
description:
  Create and render Table v9 with the ember adapter. Route reusable createTableHook
  defaults, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/ember-table'
  framework: ember
  library_version: 9.2.5
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/ember/quick-start.md
  - TanStack/table:examples/ember/basic-table
  - TanStack/table:packages/ember-table/src/index.ts
  - TanStack/table:packages/ember-table/src/use-table.ts
  - TanStack/table:packages/ember-table/src/FlexRender.gts
  - TanStack/table:docs/framework/ember/guide/composable-tables.md
  - TanStack/table:examples/ember/basic-app-table
  - TanStack/table:packages/ember-table/src/create-table-hook.ts
---

Load `intent load @tanstack/table-core#core` first for the headless model, stable inputs, and column inference.

Ember 5.8 or newer requires Embroider or ember-auto-import v2. Prefer `.gts` or `.gjs` template-tag components with Glint.

## Setup

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  FlexRenderCell,
  createColumnHelper,
  tableFeatures,
  useTable,
  type Cell,
  type Row,
} from '@tanstack/ember-table'

type Person = { id: string; name: string }

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: 'Name' }),
])
const initialData: Person[] = [{ id: '1', name: 'Ada' }]
const getRowId = (row: Person) => row.id

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

export default class PeopleTable extends Component {
  @tracked data = initialData

  table = useTable(this, () => ({
    features,
    columns,
    data: this.data,
    getRowId,
  }))

  get rows() {
    return this.table.getRowModel().rows
  }

  <template>
    <table>
      <tbody>
        {{#each this.rows as |row|}}
          <tr>
            {{#each (getAllCells row) as |cell|}}
              <td><FlexRenderCell @cell={{cell}} /></td>
            {{/each}}
          </tr>
        {{/each}}
      </tbody>
    </table>
  </template>
}
```

## Construction and rendering

`useTable` takes an options thunk. Read tracked data inside it, and keep features, atoms, and columns stable. In a component, pass `this` as the owner to bind external-atom cleanup to the component lifecycle. The one-argument thunk form remains available for standalone tables.

Read Table APIs in template-consumed getters. Column, row, cell, and header prototype methods require their receiver, so use a getter or module helper such as `getAllCells(row)` rather than an extracted method. Wrap event calls the same way.

Use `FlexRenderCell`, `FlexRenderHeader`, and `FlexRenderFooter` for the matching object. Rendered components receive `@ctx` and optional `@options` through `flexRenderComponent(Component, options)`.

With `tableFeatures({})`, render `row.getAllCells()`. Register `columnVisibilityFeature` before switching to `row.getVisibleCells()`.

## Read for the task

- When adding or configuring optional features, load `intent load @tanstack/table-core#table-features` and read only references for the requested behavior.
- For state ownership or reactive reads, read [table-state](../table-state/SKILL.md).
- When tables share features, defaults, or reusable UI, read [create-table-hook](references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/ember-table/declarations/index.d.ts`, `use-table.d.ts`, `signal.d.ts`, and `FlexRender.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
