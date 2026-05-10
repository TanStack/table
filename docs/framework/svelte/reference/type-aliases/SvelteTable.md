---
id: SvelteTable
title: SvelteTable
---

# Type Alias: SvelteTable\<TFeatures, TData, TSelected\>

```ts
type SvelteTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [packages/svelte-table/src/createTable.svelte.ts:14](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTable.svelte.ts#L14)

## Type Declaration

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.

#### Example

```ts
const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state

console.log(table.state.globalFilter)
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
