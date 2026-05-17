---
id: table_getIsSomeRowsSelected
title: table_getIsSomeRowsSelected
---

# Function: table\_getIsSomeRowsSelected()

```ts
function table_getIsSomeRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:323](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L323)

Checks whether selection is partially applied across filtered rows.

The result is true when at least one row id is selected but fewer ids are
selected than the current filtered flat row count.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const someRowsSelected = table_getIsSomeRowsSelected(table)
```
