---
name: react/compose-with-tanstack-form
description: >
  Editable cells for `@tanstack/react-table` v9 via `@tanstack/react-form`. The
  table is the layout primitive; the form owns editing state. Use
  `createFormHook` to register reusable field components (`TextField`,
  `NumberField`, `SelectField`), then in each column's `cell` return
  `<form.AppField name={`data[${row.index}].field`}>{(field) => <field.TextField />}</form.AppField>`.
  Critical typing gotcha: if your row has a recursive `subRows`, use
  `Omit<Row, 'subRows'>` for the form row type — TanStack Form's `DeepKeys`
  recurses and hits TS2589. Subscribe to `form.state.values.data.length` (not
  the whole array) for row add/remove re-renders.
type: composition
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - row-selection
  - column-definitions
  - react/table-state
sources:
  - TanStack/table:examples/react/with-tanstack-form/src/main.tsx
  - TanStack/table:examples/react/with-tanstack-form/src/form.tsx
---

This skill builds on `tanstack-table/state-management`, `tanstack-table/react/table-state`, and `tanstack-table/column-definitions`. Read those first.

## Why this exists

TanStack Table v9 deliberately ships no built-in editing — Kevin (the maintainer) scoped it out in favor of composing with TanStack Form. The form owns row-level state, validation, dirty tracking, submit; the table is the layout/sort/filter/paginate engine. This is the v9-blessed answer to "how do I make editable cells?"

## Setup

```bash
pnpm add @tanstack/react-table @tanstack/react-form zod
```

Define your field components and a form hook in a `form.tsx` module. Source: `examples/react/with-tanstack-form/src/form.tsx`.

```tsx
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext } = createFormHookContexts()

function TextField() {
  /* reads field state from fieldContext */
}
function NumberField() {
  /* … */
}
function SelectField() {
  /* … */
}
function SubmitButton() {
  /* … */
}
function FormStateIndicator() {
  /* … */
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, NumberField, SelectField },
  formComponents: { SubmitButton, FormStateIndicator },
  fieldContext,
  formContext,
})
```

## Core Pattern — editable people table

```tsx
import * as React from 'react'
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  rowPaginationFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
} from '@tanstack/react-table'
import { useStore } from '@tanstack/react-form'
import { z } from 'zod'
import { useAppForm } from './form'
import type { Person } from './makeData'

// CRITICAL: flatten recursive subRows before handing rows to the form.
// Without Omit, TanStack Form's DeepKeys walks subRows and hits TS2589.
type FormRow = Omit<Person, 'subRows'>

const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})
const columnHelper = createColumnHelper<typeof features, FormRow>()

function App() {
  const initialData: FormRow[] = makeData(100)

  const form = useAppForm({
    defaultValues: { data: initialData },
    onSubmit: ({ value }) => {
      alert(`Submitted ${value.data.length} records`)
    },
    validators: { onChange: z.object({ data: z.array(personSchema) }) },
  })

  // Memo'd columns — field bindings close over `form`, so without memoization
  // we'd build new column defs on every keystroke.
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          cell: ({ row }) => (
            <form.AppField
              name={`data[${row.index}].firstName`}
              validators={{ onChange: z.string().min(1, 'Required') }}
            >
              {(field) => <field.TextField />}
            </form.AppField>
          ),
        }),
        columnHelper.accessor('age', {
          header: 'Age',
          cell: ({ row }) => (
            <form.AppField
              name={`data[${row.index}].age`}
              validators={{ onChange: z.number().min(0).max(150) }}
            >
              {(field) => <field.NumberField />}
            </form.AppField>
          ),
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          cell: ({ row }) => (
            <form.AppField name={`data[${row.index}].status`}>
              {(field) => <field.SelectField />}
            </form.AppField>
          ),
        }),
      ]),
    [form],
  )

  // Subscribe ONLY to length — triggers re-renders on add/remove without infinite loops
  // (vs subscribing to data, which fires on every keystroke).
  const dataLength = useStore(form.store, (state) => state.values.data.length)
  void dataLength

  const table = useTable({
    features,
    columns,
    data: form.state.values.data, // table reads fresh form values each render
  })

  const addRow = () =>
    form.pushFieldValue('data', {
      firstName: '',
      lastName: '',
      age: 0,
      visits: 0,
      progress: 0,
      status: 'single',
    })

  const refreshData = () => form.reset({ data: makeData(100) })

  return (
    <>
      <button onClick={addRow}>Add Row</button>
      <button onClick={refreshData}>Refresh Data</button>
      <table>
        <thead>{/* … */}</thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <form.SubmitButton />
    </>
  )
}
```

Source: `examples/react/with-tanstack-form/src/main.tsx`.

## Add / remove rows

`form.pushFieldValue('data', newRow)` adds; `form.removeFieldValue('data', index)` removes; `form.reset({ data })` replaces. The `useStore` subscription on `state.values.data.length` re-renders the holder so the table sees the new array length and renders the new row.

## Common Mistakes

### CRITICAL Typing rows as `Person` with recursive `subRows`

Wrong:

```tsx
const form = useAppForm({ defaultValues: { data: makeData(100) as Person[] } })
// TanStack Form's DeepKeys walks Person.subRows recursively → TS2589
//   ("Type instantiation is excessively deep and possibly infinite")
```

Correct:

```tsx
type FormRow = Omit<Person, 'subRows'>
const initialData: FormRow[] = makeData(100)
const form = useAppForm({ defaultValues: { data: initialData } })
const columnHelper = createColumnHelper<typeof features, FormRow>()
```

Always strip the recursive child field from the row type you hand to the form.
Source: `examples/react/with-tanstack-form/src/main.tsx`.

### CRITICAL Subscribing to the whole `state.values.data` array

Wrong:

```tsx
// Every keystroke in any cell re-renders App → recreates form → re-binds every cell.
const data = useStore(form.store, (s) => s.values.data)
```

Correct:

```tsx
// Subscribe to length only — triggers re-renders on add/remove, ignores edits.
const dataLength = useStore(form.store, (state) => state.values.data.length)
void dataLength
// Table reads `data: form.state.values.data` directly on render.
```

Source: `examples/react/with-tanstack-form/src/main.tsx`.

### HIGH Forgetting `useMemo` around columns

Wrong:

```tsx
function App() {
  const form = useAppForm({
    /* … */
  })
  const columns = columnHelper.columns([
    // new column defs every render
    columnHelper.accessor('firstName', {
      cell: ({ row }) => (
        <form.AppField name={`data[${row.index}].firstName`}>
          {(field) => <field.TextField />}
        </form.AppField>
      ),
    }),
  ])
}
```

Correct:

```tsx
const columns = React.useMemo(
  () =>
    columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: ({ row }) => (
          <form.AppField name={`data[${row.index}].firstName`}>
            {(field) => <field.TextField />}
          </form.AppField>
        ),
      }),
    ]),
  [form],
)
```

Cell renderers close over `form`. Without memoization the column defs change every render, busting internal memos and remounting field components.
Source: `examples/react/with-tanstack-form/src/main.tsx`.

### HIGH Passing the form itself in `useTable`'s `data`

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data: form, // wrong — table only needs the row array
})
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data: form.state.values.data,
})
```

The table consumes the rows array. Mix the form's data into the table's `data` prop; don't try to make the table aware of the form instance.
Source: `examples/react/with-tanstack-form/src/main.tsx`.

### MEDIUM Trying to reuse v8's `tableMeta.updateData` pattern

Wrong:

```tsx
// v8 muscle memory: track edits in tableMeta with a per-cell useState.
const table = useReactTable({
  data,
  columns,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      /* manual setState dance */
    },
  },
})
```

Correct:

```tsx
// v9 idiom: TanStack Form owns the data, table renders it.
const form = useAppForm({ defaultValues: { data } })
const table = useTable({
  features,
  columns,
  data: form.state.values.data,
})
```

The v8 `tableMeta.updateData` pattern still works mechanically, but the form composition handles validation, dirty tracking, submit, and add/remove for free.
Source: maintainer guidance.

## See Also

- `tanstack-table/react/table-state` — base table reactivity.
- `tanstack-table/react/compose-with-tanstack-pacer` — debounce column filter inputs on the same screen.
- `tanstack-table/column-definitions` — cell renderer API.
- `tanstack-table/row-selection` — row selection works alongside per-cell editing.
