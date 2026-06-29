---
name: vue/compose-with-tanstack-form
description: >
  Editable cells with `@tanstack/vue-form` + `@tanstack/vue-table` v9. The table is the layout
  primitive; the form owns state. Wire `data: form.state.values.data` (where `data` is the
  array field) so the table reads from the form. In each column's `cell` renderer use a
  `<form.Field name="data[${row.index}].fieldName">` slot to bind an input. Typing gotcha: if
  your row type has recursive `subRows`, type the form rows as `Omit<Row, 'subRows'>` —
  TanStack Form's `DeepKeys` walks the recursion and hits TS2589. Subscribe to
  `form.state.values.data.length` (not the whole array) to drive row add/remove re-renders.
  Pair with TanStack Pacer for debounced filter inputs on the same screen.
type: composition
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - row-selection
  - column-definitions
sources:
  - examples/react/with-tanstack-form/
  - packages/vue-table/src/useTable.ts
---

# Compose @tanstack/vue-table with @tanstack/vue-form

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-form
```

`@tanstack/vue-form` exposes `useForm` and the `<Field>` / `form.Field` component pattern. It
does NOT currently ship a `createFormHook` factory — that's a React-only convenience. In Vue,
you write component-local `<form.Field>` bindings directly. The canonical example for the
_shape_ of this pattern lives in `examples/react/with-tanstack-form/`; the Vue translation
maps the React `<form.AppField>` to Vue's `<form.Field>` slot.

## Setup — editable rows

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm, useStore } from '@tanstack/vue-form'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'

// 1) Critical typing: flatten the row shape if your data is recursive.
type Person = {
  firstName: string
  lastName: string
  age: number
  subRows?: Person[] // recursive — fine for the table
}
type FormRow = Omit<Person, 'subRows'> // <-- avoid TS2589 in form DeepKeys

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
const columnHelper = createColumnHelper<typeof features, FormRow>()

// 2) Form owns the data array. The table reads it.
const form = useForm({
  defaultValues: { data: makeData(100) as FormRow[] },
  onSubmit: async ({ value }) => {
    // POST value.data
  },
})

// 3) Subscribe to LENGTH only — every keystroke re-rendering the entire table
//    is the canonical performance trap with form-in-table.
const dataLength = useStore(form.store, (s) => s.values.data.length)

// 4) Columns reference `form` via closure. Re-bind through `form.Field` slot.
const columns = computed(() =>
  columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First',
      cell: ({ row }) => {
        // Return a function/VNode that <FlexRender> can render. Easier: render
        // <form.Field> in the template by passing row.index out — see template below.
        return row.index
      },
    }),
    columnHelper.accessor('lastName', {
      header: 'Last',
      cell: ({ row }) => row.index,
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: ({ row }) => row.index,
    }),
  ]),
)

const table = useTable({
  features,
  get columns() {
    return columns.value
  },
  // 5) Critical: read straight from form state. Length subscription drives re-renders.
  get data() {
    return form.state.values.data as FormRow[]
  },
})

void dataLength

const addRow = () => {
  form.pushFieldValue('data', {
    firstName: '',
    lastName: '',
    age: 0,
  } as FormRow)
}

const removeRow = (index: number) => {
  form.removeFieldValue('data', index)
}
</script>

<template>
  <button @click="addRow">Add row</button>

  <table>
    <thead>
      <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
        <th v-for="h in hg.headers" :key="h.id">
          <FlexRender v-if="!h.isPlaceholder" :header="h" />
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- In Vue, the cleanest way to bind cells is to render <form.Field> in
           the template using row + column id, instead of stuffing JSX into
           the `cell` def. -->
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td>
          <form.Field :name="`data[${row.index}].firstName`">
            <template #default="{ field }">
              <input
                :value="field.state.value"
                @input="(e: any) => field.handleChange(e.target.value)"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>
        </td>
        <td>
          <form.Field :name="`data[${row.index}].lastName`">
            <template #default="{ field }">
              <input
                :value="field.state.value"
                @input="(e: any) => field.handleChange(e.target.value)"
              />
            </template>
          </form.Field>
        </td>
        <td>
          <form.Field :name="`data[${row.index}].age`">
            <template #default="{ field }">
              <input
                type="number"
                :value="field.state.value"
                @input="(e: any) => field.handleChange(Number(e.target.value))"
              />
            </template>
          </form.Field>
        </td>
        <td><button @click="removeRow(row.index)">×</button></td>
      </tr>
    </tbody>
  </table>
</template>
```

Source: `examples/react/with-tanstack-form/src/main.tsx` (React canonical); pattern translated
to Vue's `<form.Field>` slot API.

## Core Patterns

### 1. Form owns the data, table renders it

```ts
const form = useForm({ defaultValues: { data: makeData(100) } })

const table = useTable({
  features,
  columns,
  get data() {
    return form.state.values.data
  },
})
```

The table is a layout primitive — pagination, sorting, filtering on the form's data. The form
handles editing, validation, dirty tracking, submit.

### 2. Cell bindings via `<form.Field name="data[${row.index}].field">`

In React-form, the convention is `<form.AppField name="..." />` inside `cell:`. In Vue-form,
prefer rendering `<form.Field>` directly in the `<template>` instead of from `cell` — the slot
API doesn't translate cleanly through `cell: ({ row }) => ...` because cell functions return
VNodes, not template fragments.

If you do return VNodes from `cell`, use `h()`:

```ts
import { h } from 'vue'

columnHelper.accessor('firstName', {
  header: 'First',
  cell: ({ row, table: _t }) =>
    h(
      form.Field,
      { name: `data[${row.index}].firstName` },
      {
        default: ({ field }: any) =>
          h('input', {
            value: field.state.value,
            onInput: (e: any) => field.handleChange(e.target.value),
          }),
      },
    ),
})
```

### 3. Length-only subscription to drive add/remove re-renders

```ts
import { useStore } from '@tanstack/vue-form'

// ✅ Re-renders only when an item is added/removed — not on every keystroke.
const dataLength = useStore(form.store, (s) => s.values.data.length)
```

```ts
// ❌ Subscribing to the whole array re-renders the whole table on every keystroke.
const allData = useStore(form.store, (s) => s.values.data)
```

The table reads `form.state.values.data` synchronously per render — you don't need the full
array in a watcher; you just need to trigger a re-render when length changes.

### 4. Recursive row types: `Omit<Row, 'subRows'>` for the form

```ts
type Person = { firstName: string; subRows?: Person[] } // recursive — fine for the TABLE
type FormRow = Omit<Person, 'subRows'> // flat — required for the FORM
```

TanStack Form's `DeepKeys` walks `subRows` recursively and TypeScript hits TS2589 ("type
instantiation is excessively deep"). Always flatten the row type before passing to the form.

### 5. Pair with Pacer for debounced filter inputs on the same page

Editable cells re-render on every keystroke; a filter input on top of the same table would
recompute the row model per character. Wrap the filter writer in a debounced callback — see
`tanstack-table/vue/compose-with-tanstack-pacer`.

## Common Mistakes

### Typing rows with recursive `subRows` and feeding to `useForm` (CRITICAL)

```ts
// ❌ TS2589: "Type instantiation is excessively deep and possibly infinite"
const form = useForm({ defaultValues: { data: makeData(100) as Person[] } })

// ✅
type FormRow = Omit<Person, 'subRows'>
const form = useForm({ defaultValues: { data: makeData(100) as FormRow[] } })
```

### Subscribing to the entire `form.state.values.data` (HIGH)

```ts
// ❌ Every keystroke re-renders the entire App.
const data = useStore(form.store, (s) => s.values.data)

// ✅
const dataLength = useStore(form.store, (s) => s.values.data.length)
// then in useTable: get data() { return form.state.values.data }
```

### Putting `form` itself in `useTable`'s `data` (HIGH)

```ts
// ❌
useTable({ ..., data: form })

// ✅
useTable({ ..., get data() { return form.state.values.data } })
```

The table only consumes the rows array — not the form instance.

### Returning a `<form.Field>` template fragment from `cell:` (MEDIUM — Vue-specific)

Vue templates can't be returned from JS functions — they're compiled to render fns at build
time. From `cell:`, return either a plain value or a VNode via `h()`. For binding with
templates, render `<form.Field>` in the `<template>` instead.

### Forgetting `useMemo`/`computed` around `columns` when columns close over `form` (HIGH)

```ts
// ❌ New columns array each render → table re-binds → form bindings reset.
const columns = columnHelper.columns([
  /* refs form */
])
```

```ts
// ✅
const columns = computed(() =>
  columnHelper.columns([
    /* refs form */
  ]),
)
const table = useTable({
  features,
  get columns() {
    return columns.value
  },
  get data() {
    return form.state.values.data
  },
})
```

### Reusing the v8 `useReactTable` + `tableMeta.updateData` editable-cell pattern (HIGH)

That worked in v8 (and mechanically still does), but the v9-blessed approach is form
composition. You get validation, dirty tracking, submit, and reset for free.

### Hallucinating `createFormHook` in Vue (HIGH — Vue-specific)

`createFormHook` is React-form's factory for pre-bound field components. Vue-form does not
ship it. Use `useForm` + `<form.Field>` slots directly.

### "API missing" because feature not in `features` (CRITICAL — v9-specific)

The table still needs `tableFeatures({ rowPaginationFeature, … })` for whatever features
your editable table uses. The form composition doesn't replace that requirement.

### Reimplementing form state in `ref`s per cell (CRITICAL — #1 AI tell)

```ts
// ❌ A ref per cell, custom validation, manual dirty tracking…
const firstNameRefs = new Map<string, Ref<string>>()
```

```ts
// ✅ Let TanStack Form own it.
form.state.values.data[row.index].firstName
```

## See Also

- `tanstack-table/vue/compose-with-tanstack-pacer` — debounce filter inputs alongside editing
- `tanstack-table/vue/compose-with-tanstack-store` — share atoms with the form's `form.store`
- `tanstack-table/table-core/row-selection` — selection + editable rows together
- `tanstack-table/table-core/column-definitions` — `cell` renderer typing
