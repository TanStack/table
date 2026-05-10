---
id: expandRows
title: expandRows
---

# Function: expandRows()

```ts
function expandRows<TFeatures, TData>(rowModel): RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/createExpandedRowModel.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/createExpandedRowModel.ts#L61)

Expands a row model according to the current expanded row state.

Expanded sub-rows are inserted into the flattened row order while preserving the original row hierarchy.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### rowModel

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>
