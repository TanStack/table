---
id: table_getLeftVisibleLeafColumns
title: table_getLeftVisibleLeafColumns
---

# Function: table\_getLeftVisibleLeafColumns()

```ts
function table_getLeftVisibleLeafColumns<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:807](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L807)

Resolves visible leaf columns pinned to the left region.

Hidden pinned columns are filtered out after the left pin order is applied.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`[]

## Example

```ts
const columns = table_getLeftVisibleLeafColumns(table)
```
