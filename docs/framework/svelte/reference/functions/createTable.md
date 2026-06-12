---
id: createTable
title: createTable
---

# Function: createTable()

```ts
function createTable<TFeatures, TData, TSelected>(tableOptions, selector?): SvelteTable<TFeatures, TData, TSelected>;
```

Defined in: [packages/svelte-table/src/createTable.svelte.ts:64](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTable.svelte.ts#L64)

Creates a Svelte 5 table instance backed by rune-aware TanStack Store atoms.

The optional selector projects from `table.store`; the selected value is
exposed on `table.state`. The adapter syncs options in `$effect.pre`, so
reactive option getters and external `$state` values are applied before DOM
updates read table APIs such as `getRowModel()`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

### selector?

(`state`) => `TSelected`

## Returns

[`SvelteTable`](../type-aliases/SvelteTable.md)\<`TFeatures`, `TData`, `TSelected`\>

## Example

```svelte
<script lang="ts">
  const table = createTable(
    {
      features,
      columns,
      data,
    },
    (state) => ({ pagination: state.pagination }),
  )
</script>

{table.state.pagination.pageIndex}
```
