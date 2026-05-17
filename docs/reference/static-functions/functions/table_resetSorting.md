---
id: table_resetSorting
title: table_resetSorting
---

# Function: table\_resetSorting()

```ts
function table_resetSorting<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L60)

Resets `sorting` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.sorting` when it
exists. Passing `true` ignores initial state and resets to `[]`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetSorting(table)
table_resetSorting(table, true)
```
