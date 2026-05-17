---
id: table_setSorting
title: table_setSorting
---

# Function: table\_setSorting()

```ts
function table_setSorting<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L41)

Routes a sorting updater through the table's sorting change handler.

The updater may be a next `SortingState` array or a function of the previous
sorting state, matching the instance `table.setSorting` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`SortingState`](../../index/type-aliases/SortingState.md)\>

## Returns

`void`

## Example

```ts
table_setSorting(table, (old) => [...old, { id: 'age', desc: true }])
```
