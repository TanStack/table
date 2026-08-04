---
name: getting-started
description: >
  Create a TanStack Ember Table v9 table with useTable, a tracked options thunk, stable tableFeatures and columns, .gts templates, FlexRenderCell/Header/Footer, and correctly bound template helpers. Load for first-table setup, Glimmer reactivity, component cell renderers, or adapting another framework's example to Ember.
metadata:
  type: framework
  library: '@tanstack/ember-table'
  framework: ember
  library_version: '9.0.0'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/ember/quick-start.md'
  - 'TanStack/table:examples/ember/basic-table'
  - 'TanStack/table:packages/ember-table/src/index.ts'
  - 'TanStack/table:packages/ember-table/src/use-table.ts'
  - 'TanStack/table:packages/ember-table/src/FlexRender.gts'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Ember Table is headless: it supplies reactive table models and renderer helpers, while the application owns semantic markup, CSS, accessibility, and design-system components.

The v9 addon requires Ember 5.8 or newer with Embroider or ember-auto-import v2. Prefer `.gts`/`.gjs` template-tag components with Glint.

## Setup

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  FlexRenderCell,
  FlexRenderHeader,
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

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getRowId,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  addPerson = () => {
    this.data = [...this.data, { id: '2', name: 'Grace' }]
  }

  <template>
    <button type='button' {{on 'click' this.addPerson}}>Add person</button>
    <table>
      <thead>
        {{#each this.headerGroups as |group|}}
          <tr>
            {{#each group.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <FlexRenderHeader @header={{header}} />
                {{/unless}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </thead>
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

`useTable` takes an options thunk. Tracked properties read by that thunk update table options, and table API reads inside getters/templates participate in Glimmer tracking. Keep `features` and `columns` at stable module or component-lifetime scope; replace `@tracked data` only when data meaningfully changes.

## Ember-Specific Patterns

### Preserve method receivers in templates

V9 table, column, row, cell, and header methods live on prototypes and require their receiver. Ember templates extract function references, so call methods in a getter or a small module-level helper:

```gts
const getCanSort = (column: Column<typeof features, Person>) =>
  column.getCanSort()

const toggleSort =
  (column: Column<typeof features, Person>) => (event: Event) =>
    column.getToggleSortingHandler()?.(event)
```

Pass `toggleSort header.column` to `{{on}}`; do not pass an extracted Table method directly.

### Render definitions through the matching component

Use `FlexRenderCell`, `FlexRenderHeader`, and `FlexRenderFooter` with their matching object. A definition may return a primitive or `flexRenderComponent(Component, options)`. The rendered component receives `@ctx` and optional `@options`; Table does not instantiate arbitrary component-library markup for you.

## Common Mistakes

### HIGH Passing an options object instead of a thunk

Wrong: `useTable({ features, columns, data: this.data })`.

Correct: `useTable(() => ({ features, columns, data: this.data }))`.

The thunk is how tracked option reads are connected to the table.

### HIGH Passing an unbound prototype method to a template modifier

Wrong: `{{on 'click' header.column.getToggleSortingHandler}}`.

Correct: wrap the call in a helper that invokes the method on `header.column`, as shown above.

An extracted v9 prototype method loses `this` and can throw or silently target the wrong receiver.

### HIGH Recreating model inputs inside the options thunk

Wrong: `columns: columnHelper.columns(...)` or `data: this.data.slice()` inside `useTable(() => ...)`.

Correct: keep columns stable and pass the tracked data reference directly. The thunk may rerun; it should not manufacture new model inputs on every tracked update.

### MEDIUM Using a visibility-aware API without its feature

With `tableFeatures({})`, render `row.getAllCells()`. Add `columnVisibilityFeature` before using `row.getVisibleCells()`.

## API Discovery

Inspect `node_modules/@tanstack/ember-table/declarations/index.d.ts` for exports, `use-table.d.ts` for options/reactivity behavior, `FlexRender.d.ts` and `flex-render.d.ts` for renderer contracts, and `node_modules/@tanstack/table-core/dist/features/<feature>/` for feature-gated APIs. Do not substitute React hooks, subscriptions, or component signatures.
