---
name: solid/compose-with-tanstack-form
description: >
  Editable cells in `@tanstack/solid-table` with `@tanstack/solid-form`. The
  table is the layout primitive; the form owns the state. Build the form with
  `createFormHook` + `createFormHookContexts` to register reusable field
  components (`TextField`, `NumberField`, `SelectField`), source `data` from
  `form.state.values.data` via a reactive `get data()` getter, and render
  `<form.AppField name={...}>` inside each column's `cell`.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - row-selection
  - column-definitions
sources:
  - examples/solid/with-tanstack-form/src/App.tsx
  - examples/solid/with-tanstack-form/src/form.tsx
---

# Compose with `@tanstack/solid-form`

Editable spreadsheet-style cells. The table doesn't track values; the form
does. The table just lays out which input goes in which cell.

## Install

```bash
pnpm add @tanstack/solid-form zod
```

## Step 1 — Register field components with `createFormHook`

```tsx
// form.tsx
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/solid-form'
import { For, Show } from 'solid-js'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function TextField() {
  const field = useFieldContext<string>()
  const errors = useStore(field().store, (s) => s.meta.errors)
  return (
    <div>
      <input
        value={field().state.value}
        onInput={(e) => field().handleChange(e.currentTarget.value)}
        onBlur={() => field().handleBlur()}
      />
      <Show when={errors().length > 0}>
        <div class="error">{errors().join(', ')}</div>
      </Show>
    </div>
  )
}

function NumberField() {
  const field = useFieldContext<number>()
  const errors = useStore(field().store, (s) => s.meta.errors)
  return (
    <div>
      <input
        type="number"
        value={field().state.value}
        onInput={(e) => field().handleChange(Number(e.currentTarget.value))}
        onBlur={() => field().handleBlur()}
      />
      <Show when={errors().length > 0}>
        <div class="error">{errors().join(', ')}</div>
      </Show>
    </div>
  )
}

function SelectField() {
  const field = useFieldContext<string>()
  return (
    <select
      value={field().state.value}
      onChange={(e) => field().handleChange(e.currentTarget.value)}
    >
      <For each={['single', 'complicated', 'relationship']}>
        {(s) => <option value={s}>{s}</option>}
      </For>
    </select>
  )
}

function SubmitButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <button
      type="submit"
      disabled={!form.state.canSubmit || form.state.isSubmitting}
    >
      {form.state.isSubmitting ? 'Submitting...' : props.label}
    </button>
  )
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, NumberField, SelectField },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
})
```

`field` is itself an accessor in `@tanstack/solid-form` — it's `field().state.value`,
not `field.state.value`. Same accessor-call pattern as table state.

## Step 2 — Build the table with form-driven cells

The trick: `get data()` reads from `form.state.values.data`. The form owns the
rows; the table reflects them.

```tsx
import {
  createTable,
  createColumnHelper,
  rowPaginationFeature,
  columnFilteringFeature,
  createPaginatedRowModel,
  createFilteredRowModel,
  filterFns,
  tableFeatures,
  FlexRender,
} from '@tanstack/solid-table'
import { z } from 'zod'
import { createMemo, For } from 'solid-js'
import { useAppForm } from './form'

const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

function App() {
  const form = useAppForm(() => ({
    defaultValues: { data: makeData(100) },
    onSubmit: ({ value }) => console.log(value),
    validators: { onChange: formSchema },
  }))

  // columns depend on `form` (reactive). Wrap in createMemo for stable identity per inputs.
  const columns = createMemo(() =>
    columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => (
          <form.AppField
            name={`data[${row.index}].firstName`}
            validators={{ onChange: z.string().min(1) }}
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
            validators={{ onChange: z.number().min(0) }}
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
  )

  const table = createTable({
    features,
    get columns() {
      return columns()
    },
    get data() {
      return form.state.values.data
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(hg) => (
              <tr>
                <For each={hg.headers}>
                  {(h) => (
                    <th>
                      <FlexRender header={h} />
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(c) => (
                    <td>
                      <FlexRender cell={c} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <form.AppForm>
        <form.SubmitButton label="Save" />
      </form.AppForm>
    </form>
  )
}
```

## Why this layering works

- **`form.state.values.data` is the source of truth.** Editing a `<input>` calls
  `field().handleChange(...)`, which mutates the form's `data` array.
- **`get data() { return form.state.values.data }`** subscribes the table to
  the form. Each keystroke flows: input → form store → `data()` accessor → table → new row model → `<For each={...}>` repaints only what changed (Solid's fine-grained reactivity).
- **The table doesn't know about editing.** No `editingRowId` state, no inline
  cell mode toggles. Each row index is always editable; the column `cell`
  renderer chooses what to draw.

## Adding rows

```tsx
const addRow = () => form.pushFieldValue('data', emptyPerson())
const removeRow = (i: number) => form.removeFieldValue('data', i)
```

Combined with `manualPagination: false` (the default), the table picks up the
new row automatically.

## Combining with row-selection

If you want "delete selected rows":

1. Register `rowSelectionFeature` in `features`.
2. Add a checkbox display column. Use `row.getIsSelected()` / `row.getToggleSelectedHandler()`.
3. On delete: read `table.getSelectedRowModel().rows`, find each `row.index`, call `form.removeFieldValue('data', index)` (highest index first to avoid shifting).

## Failure modes

### CRITICAL — `field.state.value` instead of `field().state.value`

`field` is an accessor. Call it. Same trap as `table.state()`.

### CRITICAL — `data: form.state.values.data` without the getter

Same Solid pitfall as everywhere else. Reads once at construction. Use a
getter so edits flow through.

### HIGH — `columns` array not memoized when it references `form`

`columns` literally embeds `<form.AppField>` per column. If `columns` is a
plain array re-evaluated per render (or per data change), the table sees a new
columns identity and recomputes column metadata. Wrap in `createMemo`.

### HIGH — using row identity that doesn't survive add/remove

If you set `getRowId: (row, index) => String(index)`, then deleting row 0 turns
old row 1 into new row 0 — the input that was focused jumps to a different
person. Either accept that, or give each person a stable id (`row.id`) and
`getRowId: (row) => row.id`.

### MEDIUM — focus lost on every keystroke

Almost always caused by inline-defined cell components whose identity changes
each render. Define `TextField` / `NumberField` / `SelectField` once (via
`createFormHook`), reference them via `field.TextField`, and let
`<form.AppField>` own the field lifecycle. The example pattern handles this.

### MEDIUM — re-running validation on every cell render

`<form.AppField validators={{ onChange: z.something() }}>` should reference a
schema that has stable identity. Inline `z.string().min(1)` per render creates
a new schema each time; pull it to module scope or memoize.

### LOW — submitting with stale rows

Filtering or sorting affects what the table **displays**, not what the form
**holds**. `form.handleSubmit()` submits all rows in `form.state.values.data`
regardless of the table's current filter. If you only want visible rows, map
through `table.getRowModel().rows` and pull their indexes.
