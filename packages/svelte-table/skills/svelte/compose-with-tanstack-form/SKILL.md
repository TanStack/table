---
name: svelte/compose-with-tanstack-form
description: >
  Editable cells in `@tanstack/svelte-table` powered by `@tanstack/svelte-form`. The table is the
  layout primitive; the form owns the state. Use `createFormHook` to register reusable field
  components (`TextField`, `NumberField`, `SelectField`), then in each column's `cell` renderer
  return `renderComponent(MyFieldCell, { form, rowIndex, fieldName })` and inside that cell call
  `form.Field` (or an `AppField`) with `name="data[${rowIndex}].${fieldName}"`. Drive the table's
  `data` from `form.state.values.data`. Svelte 5+ only.
type: composition
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - row-selection
  - column-definitions
sources:
  - TanStack/table:examples/svelte/with-tanstack-form/
  - TanStack/table:docs/framework/svelte/svelte-table.md
---

# Compose with TanStack Form (Svelte)

Editable tables are a classic source of state-management chaos. With v9 + TanStack Form, the
division of labor is crisp:

- **Form** owns the editable values (per-row, per-field).
- **Table** owns the layout (columns, filtering, pagination of the same form data).
- **Cells** are just field renderers — they read and write through Form's field APIs.

## Install

```bash
pnpm add @tanstack/svelte-form @tanstack/svelte-table
```

## Set up a field-component-rich Form hook

Define a `createAppForm` once with the reusable field components. This is the form-side
equivalent of `createTableHook`.

```ts
// hooks/form.ts
import { createFormHook, createFormHookContexts } from '@tanstack/svelte-form'
import TextField from '../components/TextField.svelte'
import NumberField from '../components/NumberField.svelte'
import SelectField from '../components/SelectField.svelte'
import SubmitButton from '../components/SubmitButton.svelte'
import FormStateIndicator from '../components/FormStateIndicator.svelte'

export const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm: createAppForm } = createFormHook({
  fieldComponents: { TextField, NumberField, SelectField },
  formComponents: { SubmitButton, FormStateIndicator },
  fieldContext,
  formContext,
})
```

## Reusable field cell components

Each cell type is a small Svelte component that knows which row + field it edits and uses
`form.Field`. The shape is the same across types — `TextFieldCell`, `NumberFieldCell`,
`SelectFieldCell`.

```svelte
<!-- TextFieldCell.svelte -->
<script lang="ts">
  type Props = {
    form: ReturnType<typeof createAppForm>
    rowIndex: number
    fieldName: string
  }
  let { form, rowIndex, fieldName }: Props = $props()
</script>

<form.Field name={`data[${rowIndex}].${fieldName}`}>
  {#snippet children(field)}
    <input
      type="text"
      value={field.state.value}
      oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
      onblur={field.handleBlur}
    />
    {#if field.state.meta.errors?.length}
      <small class="error">{field.state.meta.errors.join(', ')}</small>
    {/if}
  {/snippet}
</form.Field>
```

## Wire the table to form state

```svelte
<script lang="ts">
  import {
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createTable,
    filterFns,
    FlexRender,
    renderComponent,
    rowPaginationFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { z } from 'zod'
  import { createAppForm } from './hooks/form'
  import TextFieldCell from './TextFieldCell.svelte'
  import NumberFieldCell from './NumberFieldCell.svelte'
  import SelectFieldCell from './SelectFieldCell.svelte'
  import { makeData, type Person } from './makeData'

  const features = tableFeatures({
    rowPaginationFeature,
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns,
  })

  const columnHelper = createColumnHelper<typeof features, Person>()

  const personSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    age: z.number().min(0).max(150),
    visits: z.number().min(0),
    progress: z.number().min(0).max(100),
    status: z.enum(['relationship', 'complicated', 'single']),
  })

  const formSchema = z.object({ data: z.array(personSchema) })
  type FormData = z.infer<typeof formSchema>

  const form = createAppForm(() => ({
    defaultValues: { data: makeData(1_000) } as FormData,
    validators: { onChange: formSchema },
    onSubmit: ({ value }) => alert(`Saved ${value.data.length} rows`),
  }))

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ row }) =>
        renderComponent(TextFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'firstName',
        }),
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: ({ row }) =>
        renderComponent(NumberFieldCell, {
          form,
          rowIndex: row.index,
          fieldName: 'age',
        }),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) =>
        renderComponent(SelectFieldCell, {
          form,
          rowIndex: row.index,
        }),
    }),
    // ...
  ])

  const table = createTable({
    features,
    columns,
    get data() {
      // The form is the source of truth.
      return form.state.values.data
    },
  })
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    void form.handleSubmit()
  }}
>
  <form.AppForm>
    {#snippet children()}
      <form.FormStateIndicator />
      <form.SubmitButton label="Save" />
    {/snippet}
  </form.AppForm>

  <button
    type="button"
    onclick={() =>
      form.pushFieldValue('data', {
        firstName: '',
        lastName: '',
        age: 0,
        visits: 0,
        progress: 0,
        status: 'single',
      })}>Add Row</button
  >

  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th><FlexRender {header} /></th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row (row.id)}
        <tr>
          {#each row.getAllCells() as cell (cell.id)}
            <td><FlexRender {cell} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</form>
```

## Why `row.index` and not `row.id`?

Form indexes its arrays positionally. `row.index` is the position inside the **current** row
model (after filter + sort + paging). If you want a positional address into `form.state.values.data`,
you usually want the **original** index — pass `row.original` somewhere that exposes it, or
store an `id` field and look it up.

For the common case where the table renders the array in its natural order (no sort, no
filter that reorders), `row.index` matches the form-array position.

## Add Row / Remove Row

Use the form's array helpers; the table re-renders because its `data` getter points at
`form.state.values.data`.

```ts
form.pushFieldValue('data', newPerson)
form.removeFieldValue('data', rowIndex)
form.replaceFieldValue('data', rowIndex, updatedPerson)
```

## Pairing with selection

Add `rowSelectionFeature` to enable row checkboxes, then a "delete selected" button can use
`table.getSelectedRowModel()` to collect rows and `form.removeFieldValue` to remove them.

```ts
const selectedRows = table.getSelectedRowModel().rows
const indexesDesc = selectedRows.map((r) => r.index).sort((a, b) => b - a)
for (const i of indexesDesc) {
  form.removeFieldValue('data', i)
}
table.resetRowSelection()
```

Remove in descending order so earlier removals don't shift later indexes.

## Pairing with virtualization

You can virtualize the rows even with editable cells — but be aware that **virtualized rows
unmount when scrolled out of view**, taking their inline form fields with them. If a cell has
unsaved local-only state, you'll lose it. Use Form fields (which live on the form's state)
and you're fine — the field state survives the unmount.

## Common failure modes

- **`renderComponent` from React docs.** Use the Svelte adapter's `renderComponent` from
  `@tanstack/svelte-table`. The signature is the same shape but the runtime is different.
- **`form` not reactive in cells.** Pass `form` as a prop; don't reach for it via context
  unless you set up `formContext`.
- **Wrong field name.** `data[${row.index}].firstName` — string template, not a plain join.
- **Reordering / filtering breaks `row.index`.** As above. Either keep a stable id and resolve
  back to the form-array index, or accept that `row.index` only addresses the visible window.
- **Editing inside virtualized rows without form state.** Field values lost on scroll.
- **Reimplementing form state with `$state` per cell.** Defeats the whole point — Form already
  owns this state and runs validation.

## Related skills

- `tanstack-table/core/row-selection` — checkbox column patterns.
- `tanstack-table/core/column-definitions` — accessor / display columns.
- `tanstack-table/svelte/table-state` — `getRowModel()` and reactivity.
