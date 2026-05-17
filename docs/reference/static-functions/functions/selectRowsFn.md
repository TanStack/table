---
id: selectRowsFn
title: selectRowsFn
---

# Function: selectRowsFn()

```ts
function selectRowsFn<TFeatures, TData>(rowModel): RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:638](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L638)

Builds a row model containing rows selected by the current row selection state.

The result is derived from the supplied row model, so selected ids absent from
that model are not materialized as rows.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### rowModel

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Example

```ts
const selectedRows = selectRowsFn(rowModel)
```
