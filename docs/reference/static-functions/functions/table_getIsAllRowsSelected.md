---
id: table_getIsAllRowsSelected
title: table_getIsAllRowsSelected
---

# Function: table\_getIsAllRowsSelected()

```ts
function table_getIsAllRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:257](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L257)

Checks whether every selectable filtered row is selected.

The result is false when there are no filtered rows or when selection state is
empty.

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
const allSelected = table_getIsAllRowsSelected(table)
```
