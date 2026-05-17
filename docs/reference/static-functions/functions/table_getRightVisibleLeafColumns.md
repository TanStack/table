---
id: table_getRightVisibleLeafColumns
title: table_getRightVisibleLeafColumns
---

# Function: table\_getRightVisibleLeafColumns()

```ts
function table_getRightVisibleLeafColumns<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:830](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L830)

Resolves visible leaf columns pinned to the right region.

Hidden pinned columns are filtered out after the right pin order is applied.

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
const columns = table_getRightVisibleLeafColumns(table)
```
