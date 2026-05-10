---
id: table_getLeftTotalSize
title: table_getLeftTotalSize
---

# Function: table\_getLeftTotalSize()

```ts
function table_getLeftTotalSize<TFeatures, TData>(table): any;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L289)

Returns left total size for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`

## Example

```ts
const value = table_getLeftTotalSize(table)
```
