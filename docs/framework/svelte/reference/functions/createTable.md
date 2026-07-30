---
id: createTable
title: createTable
---

# Function: createTable()

```ts
function createTable<TFeatures, TData>(tableOptions): SvelteTable<TFeatures, TData>;
```

Defined in: [packages/svelte-table/src/createTable.svelte.ts:46](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTable.svelte.ts#L46)

Creates a Svelte 5 table instance backed by rune-aware TanStack Store atoms.

Read a specific state slice with `table.atoms.<slice>.get()` and read the
complete state with `table.store.get()`. Those reads participate in Svelte
dependency tracking when they run in a template, `$derived`, or `$effect`.
The adapter syncs options in `$effect.pre`, so reactive option getters and
external `$state` values are applied before DOM updates read table APIs such
as `getRowModel()`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

## Returns

[`SvelteTable`](../type-aliases/SvelteTable.md)\<`TFeatures`, `TData`\>

## Example

```svelte
<script lang="ts">
  const table = createTable({ features, columns, data })

  const pagination = $derived(table.atoms.pagination.get())
  const stateJson = $derived(JSON.stringify(table.store.get(), null, 2))
</script>

<span>Page {pagination.pageIndex + 1}</span>
<pre>{stateJson}</pre>
```
