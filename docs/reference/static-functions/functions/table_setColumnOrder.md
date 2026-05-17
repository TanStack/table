---
id: table_setColumnOrder
title: table_setColumnOrder
---

# Function: table\_setColumnOrder()

```ts
function table_setColumnOrder<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L104)

Routes a column order updater through the table's column-order change handler.

The updater may be a next ordered id array or a function of the previous
array, matching the instance `table.setColumnOrder` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnOrderState`](../../index/type-aliases/ColumnOrderState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnOrder(table, ['firstName', 'lastName', 'age'])
```
