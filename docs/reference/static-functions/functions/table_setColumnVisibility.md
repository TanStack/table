---
id: table_setColumnVisibility
title: table_setColumnVisibility
---

# Function: table\_setColumnVisibility()

```ts
function table_setColumnVisibility<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:261](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L261)

Routes a column visibility updater through the table's visibility change handler.

The updater may be a next visibility map or a function of the previous map,
matching the instance `table.setColumnVisibility` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnVisibilityState`](../../index/type-aliases/ColumnVisibilityState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnVisibility(table, (old) => ({ ...old, age: false }))
```
