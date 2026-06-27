---
id: table_getIsSomePageRowsSelected
title: table_getIsSomePageRowsSelected
---

# Function: table\_getIsSomePageRowsSelected()

```ts
function table_getIsSomePageRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:412](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L412)

Checks whether the current page has a partial selection.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
```
