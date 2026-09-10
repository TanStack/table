---
id: SvelteTable
title: SvelteTable
---

# Type Alias: SvelteTable\<TFeatures, TData\>

```ts
type SvelteTable<TFeatures, TData> = Table<TFeatures, TData>;
```

Defined in: [packages/svelte-table/src/createTable.svelte.ts:18](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTable.svelte.ts#L18)

A Svelte-aware TanStack Table instance.

Table APIs and `table.atoms.<slice>.get()` reads participate in Svelte
dependency tracking when used in templates, `$derived`, or `$effect`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
