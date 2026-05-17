---
id: table_setColumnSizing
title: table_setColumnSizing
---

# Function: table\_setColumnSizing()

```ts
function table_setColumnSizing<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:255](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L255)

Routes a committed column sizing updater through the table's sizing handler.

The updater may be a next size map or a function of the previous map,
matching the instance `table.setColumnSizing` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnSizingState`](../../index/type-aliases/ColumnSizingState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnSizing(table, (old) => ({ ...old, age: 96 }))
```
