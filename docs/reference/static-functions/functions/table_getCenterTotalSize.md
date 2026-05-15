---
id: table_getCenterTotalSize
title: table_getCenterTotalSize
---

# Function: table\_getCenterTotalSize()

```ts
function table_getCenterTotalSize<TFeatures, TData>(table): any;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:332](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L332)

Returns center total size for the table.

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
const value = table_getCenterTotalSize(table)
```
