---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. The `@tanstack/table-core` package gives you the framework-agnostic core directly, so you provide the rendering and subscribe to table state changes yourself. This page gets you from install to a rendering vanilla table, then shows how to layer on your first feature.

## Installation

```bash
npm install @tanstack/table-core
```

## Your First Table

The TypeScript module below is complete. Use it with an HTML page that contains `<div id="app"></div>` and you will see a working table.

```ts
import {
  constructTable,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/table-core'
import { FlexRender } from '@tanstack/table-core/flex-render'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. Give your data a stable reference
const data: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 3. New in v9: declare which features this table uses
const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})

// 4. Define your columns. Renderers return values or HTML strings.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => '<span>Last Name</span>',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

// 5. Create the table instance
const table = constructTable({
  features,
  columns,
  data,
})

const app = document.getElementById('app')

if (!app) {
  throw new Error('Missing #app element')
}

// 6. Render markup from the table instance APIs
const renderTable = () => {
  const tableElement = document.createElement('table')
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')

  table.getHeaderGroups().forEach((headerGroup) => {
    const tr = document.createElement('tr')

    headerGroup.headers.forEach((header) => {
      const th = document.createElement('th')
      th.innerHTML = header.isPlaceholder
        ? ''
        : String(FlexRender({ header }) ?? '')
      tr.appendChild(th)
    })

    thead.appendChild(tr)
  })

  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement('tr')

    row.getAllCells().forEach((cell) => {
      const td = document.createElement('td')
      td.innerHTML = String(FlexRender({ cell }) ?? '')
      tr.appendChild(td)
    })

    tbody.appendChild(tr)
  })

  tableElement.appendChild(thead)
  tableElement.appendChild(tbody)

  app.replaceChildren(tableElement)
}

table.store.subscribe(() => renderTable())
renderTable()
```

A few things to note:

- `tableFeatures({...})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included automatically. Feature row models (sorting, filtering, pagination) are registered as slots directly on the `tableFeatures({...})` call when you need them.
- Vanilla usage must provide `coreReactivityFeature: storeReactivityBindings()` because there is no framework adapter to wire the core TanStack Store atoms into a rendering system for you.
- `FlexRender` renders the `header`, `cell`, and `footer` definitions from your columns. In vanilla usage, renderers commonly return strings or HTML strings that you place into the DOM.
- Subscribe to `table.store` when your UI should redraw after table state changes.

See the full [Basic example](./examples/basic) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the `sortedRowModel` factory in `tableFeatures`, then wire the header click handler.

```ts
import {
  constructTable,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

// columns and data unchanged from above

const table = constructTable({
  features,
  columns,
  data,
})
```

```ts
// In renderTable, replace the header rendering with sortable header markup.
table.getHeaderGroups().forEach((headerGroup) => {
  const tr = document.createElement('tr')

  headerGroup.headers.forEach((header) => {
    const th = document.createElement('th')
    const button = document.createElement('button')

    button.type = 'button'
    button.disabled = !header.column.getCanSort()
    button.innerHTML = header.isPlaceholder
      ? ''
      : String(FlexRender({ header }) ?? '')
    button.innerHTML +=
      {
        asc: ' 🔼',
        desc: ' 🔽',
      }[header.column.getIsSorted() as string] ?? ''
    button.addEventListener('click', (event) => {
      header.column.getToggleSortingHandler()?.(event)
    })

    th.appendChild(button)
    tr.appendChild(th)
  })

  thead.appendChild(tr)
})
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model factory (if it has one) in `tableFeatures`, then use the APIs it adds to the table, columns, and rows. See the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms. When you use `@tanstack/table-core` directly, you decide when to read state, subscribe to state, and redraw your UI. You usually do not need to manage state yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state). It is the foundational guide for vanilla usage.

**Feature examples.** Browse runnable vanilla examples such as [Pagination](./examples/pagination) and [Sorting](./examples/sorting) to see complete DOM rendering setups.

**Core guides.** The framework-agnostic guides cover the main table objects: [Data](../../guide/data), [Column Definitions](../../guide/column-defs), [Table Instance](../../guide/tables), [Rows](../../guide/rows), [Cells](../../guide/cells), and [Header Groups](../../guide/header-groups).
