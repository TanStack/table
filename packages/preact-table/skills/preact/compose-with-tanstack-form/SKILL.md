---
name: preact/compose-with-tanstack-form
description: >
  Editable cells with `@tanstack/preact-form`. The table is the layout
  primitive; the form owns the state. Use `createFormHook` to register
  reusable field components (`TextField`, `NumberField`, `SelectField`), and
  in each column's `cell` renderer return the matching field component bound
  to that row's accessor. Row identity (via `getRowId`) keeps field state
  stable as rows resort / re-filter. Routing keywords: preact-form, editable
  cells, inline editing, createFormHook, FieldGroup, getRowId.
type: composition
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - row-selection
  - column-definitions
sources:
  - TanStack/table:examples/react/with-tanstack-form/
  - TanStack/table:docs/framework/preact/preact-table.md
---

This skill is the Preact recipe for editable cells via @tanstack/preact-form. The Preact-Form API mirrors the React-Form API closely; the table half of the recipe is what you'd write in vanilla Preact + Table v9.

> **No dedicated examples/preact/with-tanstack-form yet** — the reference implementation lives under `examples/react/with-tanstack-form/` and ports line-for-line to Preact. The patterns below are the supported integration shape.

## Install

```bash
npm install @tanstack/preact-form @tanstack/preact-table
```

Peer dependency: `preact >=10`.

## The Division of Labor

| Concern                                          | Owner              |
| ------------------------------------------------ | ------------------ |
| Layout (rows, columns, headers)                  | Table              |
| Cell rendering API                               | Table              |
| Sorting / filtering / pagination                 | Table              |
| Row identity                                     | Table (`getRowId`) |
| Field state (value, errors, touched, validation) | Form               |
| Form-level submit handler                        | Form               |

The table never owns cell values for the purposes of editing — it renders fields, the form holds the values, and on submit you read from the form snapshot.

## Pattern — `createFormHook` + field-component cells

Define reusable field components once. Compose them with `createFormHook` to get a typed `useAppForm`. In each editable column's `cell` renderer, plug the field component into `form.AppField` keyed by the row id.

```tsx
import { createFormHook, createFormHookContexts } from '@tanstack/preact-form'

// Field components (one-off — text input, number input, etc.).
function TextField({ field }) {
  return (
    <input
      type="text"
      value={field.state.value as string}
      onInput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
      onBlur={field.handleBlur}
    />
  )
}

function NumberField({ field }) {
  return (
    <input
      type="number"
      value={field.state.value as number}
      onInput={(e) =>
        field.handleChange(Number((e.target as HTMLInputElement).value))
      }
      onBlur={field.handleBlur}
    />
  )
}

export const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField },
  formComponents: {},
})
```

Use the form per-row, keyed by `row.id`. Tables built with `getRowId` keep the same row id across re-sorts and refilters, so the form state stays attached to the same logical row.

```tsx
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { useAppForm } from './form-hook'

type Person = { id: string; firstName: string; age: number }

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Person>()

function EditableTable({ data }: { data: Person[] }) {
  const table = useTable({
    features,
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row, getValue }) => (
          <RowFieldCell
            rowId={row.id}
            field="firstName"
            defaultValue={getValue()}
            kind="text"
          />
        ),
      }),
      columnHelper.accessor('age', {
        header: 'Age',
        cell: ({ row, getValue }) => (
          <RowFieldCell
            rowId={row.id}
            field="age"
            defaultValue={getValue()}
            kind="number"
          />
        ),
      }),
    ]),
    data,
    getRowId: (row) => row.id, // CRITICAL — keeps form state attached to a row identity
  })

  return (
    <table>
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
  )
}

// One small form per row.
function RowFieldCell({
  rowId,
  field,
  defaultValue,
  kind,
}: {
  rowId: string
  field: string
  defaultValue: unknown
  kind: 'text' | 'number'
}) {
  const form = useAppForm({
    defaultValues: { [field]: defaultValue },
    onSubmit: async ({ value }) => {
      await saveRow(rowId, value)
    },
  })

  return (
    <form.AppField name={field as never}>
      {(f) => (kind === 'text' ? <f.TextField /> : <f.NumberField />)}
    </form.AppField>
  )
}
```

The bulk-edit alternative is a single top-level form with `<form.Field name={\`rows.${row.id}.firstName\`}>` per cell. Either pattern works; pick whichever matches your save shape.

## Common Mistakes

### CRITICAL Forgetting `getRowId`

Wrong:

```tsx
useTable({ features, columns, data /* no getRowId */ })
```

Correct:

```tsx
useTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id,
})
```

Without `getRowId`, the table assigns positional ids. Sorting or filtering changes row ids, and per-row form state ends up bound to a different logical row.
Source: `docs/framework/preact/guide/table-state.md`.

### HIGH Storing editable values in the table state instead of the form

Wrong: putting per-cell drafts in `table.atoms` slices, or in `table.options.data`.

Correct: leave the table data immutable; let the form hold the in-flight values. Only update the table data on save (refresh from server or splice in the new row).

### HIGH Re-rendering the entire table on every keystroke

Wrong: the top-level `useTable` selects every form draft state slice.

Correct: form field state is held in the form, not the table. The table re-renders only when actual table state changes. Field re-renders happen inside `<f.Field>` automatically.

### MEDIUM Reimplementing form validation by hand

Wrong: ad hoc `onChange` per field with validation logic in each cell.

Correct: use `@tanstack/preact-form`'s validators (`validators: { onChange: schema }`). The form handles touched / dirty / error state; the table just renders the field.

## See Also

- `tanstack-table/preact/table-state` — Subscribe / atoms / FlexRender.
- `tanstack-table/row-selection` — combining row selection with bulk edit.
- `tanstack-table/column-definitions` — column helper with TFeatures.
